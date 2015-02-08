var Header = React.createClass({
  render: function(){
    return (
      <div id="header">
        <div className="bg"></div>
        <div id="logomark" className="icon-Weebly-Logo"></div>
      </div>
    );
  }
});

var SideBarTemplatesPage = React.createClass({
  backToNormal: function(){
    $(this.refs.pageButton.getDOMNode()).removeClass('delete');
  },
  beforeDelete: function(){
    $(this.refs.pageButton.getDOMNode()).addClass('delete');    
  },
  deletePage: function(e){
    this.props.onDelete(this);
    e.stopPropagation();
  },
  onPageButtonClick: function(){
    this.props.page.isSelected = true;
    this.props.onClick(this);
  },
  editPage: function(e){
    $(this.refs.label.getDOMNode()).attr('contenteditable', 'true').addClass('editing').focus();
    e.stopPropagation();
  },
  preventSelection: function(e){
    if($(this.refs.label.getDOMNode()).hasClass('editing'))
      e.stopPropagation();
  },
  submitHandler: function(e){
    if(e.keyCode === 13){
      e.preventDefault();
      this.saveContent();
      return;
    }
  },
  saveContent: function(){
    $(this.refs.label.getDOMNode()).removeAttr('contenteditable').removeClass('editing');
    this.props.page.pageName = this.refs.label.getDOMNode().innerText;
    this.props.onPageUpdate(this);
  },
  render: function(){
    var isSelected = this.props.page.isSelected ? 'selected' : '';
    return (
      <div className={isSelected + " page" } 
            ref="pageButton" 
            onClick={this.onPageButtonClick}>
        <span className="name input-name" 
              ref="label" 
              onClick={this.preventSelection}
              onBlur={this.saveContent} 
              onKeyDown={this.submitHandler}>
              {this.props.page.pageName}
        </span>
        <span className="icon delete" 
              onClick={this.deletePage} 
              onMouseOver={this.beforeDelete} 
              onMouseOut={this.backToNormal}>
        </span>
        <span className="icon edit" 
              onClick={this.editPage}>
        </span>
      </div>
    );
  }
});

var SideBarTemplates = React.createClass({
  componentDidMount: function(){
    // this.props.onPageUpdate(this.props.pages);
  },
  formSubmit: function(e){
    e.preventDefault();
    this.addPage();
  },
  onMouseOut: function(){
    $(this.refs.addButton.getDOMNode()).removeClass('hover');
  },
  onMouseOver: function(){
    $(this.refs.addButton.getDOMNode()).addClass('hover');
  },
  addPage: function(){

    var pageName = this.refs.input.getDOMNode().value;
    if(!pageName) return;

    this.props.pages.push({
      pageName: pageName, 
      pageID: GUID(), 
      isSelected: false,
      pageContent: {elements: []}
    });
    this.refs.input.getDOMNode().value = '';
    this.forceUpdate();
    this.props.onPageUpdate(this.props.pages);
  
  },
  deletePage: function(child, e){
    var pages = this.props.pages;
    var position = pages.indexOf(pages.filter(function(v,i){ return v.pageID == child.props.page.pageID })[0]);
    this.props.pages.splice(position, 1);

    this.forceUpdate();
    this.props.onPageUpdate(this.props.pages);

  },
  togglePageButton: function(child){
    var self = this;
    this.props.pages.forEach(function(page, i){
      self.props.pages[i].isSelected = false;
      if(page.pageID == child.props.page.pageID){
        self.props.pages[i].isSelected = true;
      }
    });
    this.setState({selectedPage: child.props.page.pageID});
    this.props.onPageUpdate(this.props.pages);
    
  },
  pageUpdate: function(child){
    var self = this;
    this.props.pages.forEach(function(page, i){
      if(page.pageID == child.props.page.pageID){
        self.props.pages[i] = child.props.page;
      }
    });
    this.props.onPageUpdate(this.props.pages);
  },
  render: function(){
    var self = this;
    return (
      <div className="item" id="templates">
        <div className="divider">
          Templates
        </div>
        <div className="content">
          <div className="pages">
            <ul>
              {this.props.pages.map(function(page, i){
                return (
                  <li key={i}>
                    <SideBarTemplatesPage 
                      onClick={self.togglePageButton}
                      onDelete={self.deletePage} 
                      page={page}
                      onPageUpdate={self.pageUpdate}/>
                    </li>
                  );
              })}
            </ul>
            <div id="add-page">
              <form onSubmit={this.formSubmit} 
                    onMouseOut={this.onMouseOut} 
                    onMouseOver={this.onMouseOver}>
                <input type="text" 
                      className="input" 
                      placeholder="add new page" 
                      ref="input" 
                      onFocus={this.onMouseOver} 
                      onBlur={this.onMouseOut}/>
                <span className="icon add" 
                      onClick={this.addPage} 
                      ref="addButton">
                </span>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var SideBarElementsIcons = React.createClass({
  render: function(){
    return (
      <div className="element">
        <div className={this.props.typeName + " image"} data-type={this.props.typeID}></div>
        <div className="label">{this.props.typeDisplay}</div>
      </div>
    );
  }
})

var SideBarElements = React.createClass({
  componentDidMount: function(){
    var self = this;
    $('#elements .element .image').draggable({
      connectToSortable: ".sort",
      helper: function(){
        return React.renderToString(React.createElement('div', {className: $(this).attr('class')}, null));
      },
      revert: "invalid",
      revertDuration: 200,
    });
  },
  render: function(){
    return (
      <div className="item" id="elements">
        <div className="divider">
          Elements
        </div>
        <div className="content">
          <ul>
            <li className="sidebar-element">
              <SideBarElementsIcons typeID="1" typeName="title-icon" typeDisplay="Title" />
            </li>
            <li className="sidebar-element">
              <SideBarElementsIcons typeID="2" typeName="text-icon" typeDisplay="Text" />
            </li>
            <li className="sidebar-element">
              <SideBarElementsIcons typeID="3" typeName="img-icon" typeDisplay="Image" />
            </li>
            <li className="sidebar-element">
              <SideBarElementsIcons typeID="4" typeName="nav-icon" typeDisplay="Nav" />
            </li>
          </ul>
          <div className="clearfix"></div>
        </div>
      </div>
    );
  }
});

var SideBarSettings = React.createClass({
  getInitialState: function() {
    return {isChecked: false};
  },
  toggleCheckBox: function(){
    this.setState({isChecked : !this.state.isChecked});
  },
  render: function(){
    var checkboxState = this.state.isChecked ? 'checked' : '';
    return (
      <div className="item" id="settings">
        <div className="divider">
          Settings
        </div>
        <div className="content">
          <ul>
            <li className="settings-item-container">
              <div className="settings-item site-grid">
                site grid
                <span className={checkboxState + " checkbox icon-Toggle-Switch"} onClick={this.toggleCheckBox}></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

var SideBar = React.createClass({
  onPageUpdate: function(pages){
    this.props.onPageUpdate(pages);
  },
  render: function(){
    return (
      <div id="sidebar">
        <SideBarTemplates onPageUpdate={this.onPageUpdate} 
                          pages={this.props.pages}/>
        <SideBarElements />
        <SideBarSettings />
      </div>
    );
  }
});

var ElementEventsMixin = {
  deleteMouseOver: function(e){
    $(e.currentTarget).siblings().hide();
    $(this.getDOMNode()).closest('.editor-element').addClass('delete');
  },
  deleteMouseOut: function(e){
    $(e.currentTarget).siblings().show();
    $(this.getDOMNode()).closest('.editor-element').removeClass('delete');
  },
  deleteOnClick: function(e){
    var node = $(this.getDOMNode()).closest('li.sort-item');
    var location = node.data('location').split('-');
    var elementID = location[1];
    var parentID = location[0];
    
    this.props.onDelete(elementID, parentID);
  }
};

var TitleElement = React.createClass({
  mixins: [ElementEventsMixin],
  getInitialState: function(){
    return {el: this.props.el};
  },
  saveContent: function(e){
    var node = $(this.getDOMNode()).closest('li.sort-item');
    var location = node.data('location').split('-');
    var elementID = location[1];
    var parentID = location[0];
    var el = this.state.el;
    el.props.content = e.target.value;
    this.props.onUpdate(elementID, parentID, this.state.el);
  },
  render: function(){
    return (
      <div className="editor-element editor-element-title">
        <div className="controls">
          <div className="editor-element-handle left-handle"></div>
          <div className="editor-element-handle right-handle"></div>
          <div className="editor-element-handle bottom-handle"></div>
          <div className="delete" onMouseOver={this.deleteMouseOver} onMouseOut={this.deleteMouseOut} onClick={this.deleteOnClick}></div>
        </div>
        <textarea type="text" className="input"
                placeholder="Start typing here" 
                defaultValue={this.state.el.props.content}
                onKeyUp={this.saveContent}>
        </textarea>
      </div>
    );
  }
});

var TextElement = React.createClass({
  mixins: [ElementEventsMixin],
  getInitialState: function(){
    return {el: this.props.el};
  },
  saveContent: function(e){
    var el = this.state.el;
    el.props.content = e.target.value;
    var node = $(this.getDOMNode()).closest('li.sort-item');
    var location = node.data('location').split('-');
    var elementID = location[1];
    var parentID = location[0];

    this.props.onUpdate(elementID, parentID, this.state.el);
  },

  render: function(){
    return (
      <div className="editor-element editor-element-text">
        <div className="controls">
          <div className="editor-element-handle left-handle"></div>
          <div className="editor-element-handle right-handle"></div>
          <div className="editor-element-handle bottom-handle"></div>
          <div className="delete" onMouseOver={this.deleteMouseOver} onMouseOut={this.deleteMouseOut} onClick={this.deleteOnClick}></div>
        </div>
        <textarea type="text" className="input"
                  placeholder="Start typing here" 
                  defaultValue={this.state.el.props.content}
                  onKeyUp={this.saveContent}>
        </textarea>
      </div>
    );
  }
});

var ImageElement = React.createClass({
  mixins: [ElementEventsMixin],
  render: function(){
    return (
      <div className="editor-element editor-element-image">
        <div className="controls">
          <div className="editor-element-handle left-handle"></div>
          <div className="editor-element-handle right-handle"></div>
          <div className="editor-element-handle bottom-handle"></div>
          <div className="delete" onMouseOver={this.deleteMouseOver} onMouseOut={this.deleteMouseOut} onClick={this.deleteOnClick}></div>
        </div>
        <div className="image-element">
          <div className="image-placeholder icon-Image-Placeholder"></div>
          <div className="label">add image +</div>
        </div>
      </div>
    );
  }
});

var NavElement = React.createClass({
  mixins: [ElementEventsMixin],
  render: function(){
    return (
      <div className="editor-element editor-element-nav">
        <div className="controls">
          <div className="editor-element-handle left-handle"></div>
          <div className="editor-element-handle right-handle"></div>
          <div className="editor-element-handle bottom-handle"></div>
          <div className="delete" onMouseOver={this.deleteMouseOver} onMouseOut={this.deleteMouseOut} onClick={this.deleteOnClick}></div>
        </div>
        <p className="placeholder">Nav</p>
      </div>
    );
  }
});

var EditorContent = React.createClass({
  getInitialState: function() {
    return this.props.elements;
  },

  shouldComponentUpdate: function(nextProps, nextState){
    nextState.elements = nextState.elements.filter(function(value, index, arr){ return value.length > 0; });
    return (nextState.hasOwnProperty('silent')) ? !nextState.silent : true;
  },

  componentDidMount: function(){
    this.enableSorting();
  },

  componentDidUpdate: function(){
    this.enableSorting();
  },

  onElementUpdate: function(elementID, parentID, el){
    var self = this;
    var elements = this.state.elements;
    elements[parentID][elementID] = el;
    
    this.setState({
      silent: true,
      elements: elements
    }, function(){
      self.props.onUpdate(elements);
    });

  },

  onElementDelete: function(elementID, parentID){
    var elements = this.state.elements;
    elements[parentID].splice(elementID, 1);
    
    this.setState({
      silent: false,
      elements: elements
    }, function(){
      self.props.onUpdate(elements);
    });

  },

  renderElement: function(el){
    var elType = el.type;
    var content = el.props.content;
    var element;
    switch(elType){
      case 1:
        element = (<TitleElement el={el} 
                                    onUpdate={this.onElementUpdate} 
                                    onDelete={this.onElementDelete}/>);
        break;
      case 2:
        element = (<TextElement  el={el} 
                                onUpdate={this.onElementUpdate} 
                                onDelete={this.onElementDelete}/>);
        break;
      case 3:
        element = (<ImageElement  el={el} 
                                  onUpdate={this.onElementUpdate} 
                                  onDelete={this.onElementDelete}/>);
        break;
      case 4:
        element = (<NavElement  el={el} 
                                onUpdate={this.onElementUpdate} 
                                onDelete={this.onElementDelete}/>);
        break;
    }
    return element;
  },

  enableSorting: function(){
    var self = this;
    var stateElements = this.state.elements;

    this.sort = $(".sort").sortable({
      forceHelperSize: false,
      forcePlaceholderSize: false,
      handle: '.editor-element-handle',
      revert: 1,
      distance: 0.001,
      scroll: true,
      connectWith: ".sort",
      placeholder: {
        element: function(currentItem) {
          var parent = $(this).closest('ul'), height = '1px';
          if(parent.data('parent-id') != null){
            height = parent.height() + 'px';
          }else{
            height = '1px';
          }
          return $("<li class='editor-element-placeholder'></li>")[0];
        },
        update: function(container, el) {
          return;
        }
      },
      start: function(event, ui){
        ui.item.addClass('sort-item-moving');
      },
      stop: function(event, ui){
        var position = ui.item.index();
        var category = ui.item.closest('ul').data('parent-id');
        var elements = self.state.elements;

        ui.item.removeClass('sort-item-moving');

        if(ui.item.hasClass('image')){

          var el = {
            type: ui.item.data('type'),
            id: GUID(),
            props: {
              content : ''
            }
          };

          if(ui.item.closest('ul').hasClass('vertical')){
            elements.splice(position, 0, [el]);
          }else{
            elements[category].splice(position, 0, el); 
          }
      
          ui.item.remove();

          self.setState({
            silent: false,
            elements: elements
          }, function(){
            self.enableSorting();
            self.props.onUpdate(elements);
          });

        }else if(ui.item.hasClass('sort-item')){
          var targetPosition = ui.item.index();
          var targetParent = ui.item.closest('ul.horizontal').parent('li').index();
          var location = ui.item.data('location').split('-');
          var sourcePosition = location[1];
          var sourceParent = location[0];

          if(ui.item.closest('ul').hasClass('vertical')){
            elements.splice(targetParent, 0, [elements[sourceParent].splice(sourcePosition, 1)[0]]);
          }else{
            elements[targetParent].splice(targetPosition, 0, elements[sourceParent].splice(sourcePosition, 1)[0]);
          }

          self.sort.sortable('cancel');
          ui.item.parents('ul.vertical').find('.ui-draggable').remove();
          
          self.setState({
            silent: false,
            elements: elements
          }, function(){
            self.enableSorting();
            self.props.onUpdate(elements);
          });
        }else{
          // self.sort.sortable('cancel');
        }
      }
    });
  },

  render: function(){
    var self = this;
    var elements = $.map(this.state.elements,function(item, index1){
      return (
        <li className="sort-item" key={index1}>
          <ul className="sort horizontal" data-id="2" data-parent-id={index1} data-length={item.length}>
            {item.map(function(el, index2){
              var style = {
                width: Math.floor(95/item.length) + '%'
              };
              return (
                <ListItem render={self.renderElement} style={style} index1={index1} index2={index2} el={el} key={el.id}/>
              );  
            })}
          </ul>
        </li>
      );
    });

    return (
      <div className="page-content">
        <ul className="sort vertical" data-id="1" data-length={elements.length}>
          {elements}
        </ul>
      </div>
    );
  }

});

var ListItem = React.createClass({
  render: function(){
    return (
      <li className="sort-item" 
          style={this.props.style} 
          data-element-id={this.props.index2} 
          data-parent-id={this.props.index1}
          data-location={this.props.index1 + '-' + this.props.index2}>
        {this.props.render(this.props.el)}
      </li>
    );
  }
});

var EditorPageNavigation = React.createClass({
  getInitialState: function(){
    return {'pages': this.props.pages};
  },
  onPageSelect: function(page, index){
    if(!page.isSelected)
      this.props.onPageSelect(index);
  },
  updatePageNavigation: function(pages){
    // this.state.pages = pages;
    // this.forceUpdate();
  },
  render: function(){
    var self = this;
    var pages = this.props.pages || [];
    return (
      <div id="page-navigation">
        <ul>
          {pages.map(function(page, i){
            return (
              <li className="page-container" onClick={self.onPageSelect.bind(this, page, i)} key={i}>
                <div className={(page.isSelected == true? 'selected' : '') + " page"}>
                  <span className="name">{page.pageName}</span>
                </div>
              </li>
            );
          }, this)}
        </ul>
      </div>
    );
  }
});

var Editor = React.createClass({

  currentPageIndex: 0,

  getInitialState: function(){
    return {'pages': this.props.pages};
  },

  pageSelect: function(pageIndex){
    window.editorContent = this.refs.editorContent;
    this.currentPageIndex = pageIndex;
    var self = this;
    this.props.pages.forEach(function(page, i){
      self.props.pages[i].isSelected = false;
    });
    this.state.pages[this.currentPageIndex].isSelected = true;
    this.updatePageNavigation();

    this.refs.editorContent.setState({
      elements: this.state.pages[this.currentPageIndex].pageContent.elements,
      'silent': false,
    });
  },

  shouldComponentUpdate: function(nextProps, nextState){
    return nextState.hasOwnProperty('silent') ? !nextState.silent : false;
  },

  updatePageNavigation: function(){
    this.refs.editorPageNavigation.setState({
      'pages': this.state.pages
    });
  },

  onUpdate: function(elements){
    this.props.pages[this.currentPageIndex].pageContent.elements = elements;
  },

  render: function(){
    return (
      <div id="editor">
        <EditorPageNavigation ref="editorPageNavigation" 
                              pages={this.state.pages} 
                              onPageSelect={this.pageSelect}/>
        <EditorContent  ref="editorContent" 
                        elements={this.state.pages[this.currentPageIndex].pageContent}
                        onUpdate={this.onUpdate}/>
      </div>
    );
  }
});

var Application = React.createClass({
  onPageUpdate: function(pages){
    var self = this;
    this.refs.editor.setState({
      'silent': true,
      'pages': pages
    }, function(){
      self.refs.editor.updatePageNavigation();
    });
  },

  handleResize: function(e) {
    if(window.innerWidth < 850){
      $(this.refs.editor.getDOMNode()).addClass('overlap');
    }else{
      $(this.refs.editor.getDOMNode()).removeClass('overlap');
    }
  },

  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },

  render: function(){

    return (
      <div>
        <Header />
        <SideBar 
          onPageUpdate={this.onPageUpdate} 
          pages={this.props.pages}/>
        <Editor 
          ref="editor" 
          pages={this.props.pages}/>
      </div>
    );
  }
});

var Pages = [{
    pageName: 'Home',
    pageID: GUID(),
    isSelected: true,
    pageContent: {
        elements: [
            [{
                type: 2,
                id: GUID(),
                props: {
                    content: ''
                }
            }]
        ]
    }
}];
  


React.render(<Application pages={Pages}/>, document.getElementById("main"));

function GUID(){
  return Math.random().toString(36).substring(7);
}