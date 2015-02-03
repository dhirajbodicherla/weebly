
var Header = React.createClass({
  render: function(){
    return (
      <div id="header">
        <div className="bg"></div>
        <div id="logomark"></div>
      </div>
    );
  }
});

var SideBarTemplatesPages = React.createClass({
  backToNormal: function(){
    $(this.refs.pageButton.getDOMNode()).removeClass('delete');
  },
  beforeDelete: function(){
    $(this.refs.pageButton.getDOMNode()).addClass('delete');    
  },
  deletePage: function(){
    this.props.onDelete(this);
  },
  onPageButtonClick: function(){
    this.props.page.isSelected = true;
    this.props.onClick(this);
  },
  editPage: function(){
    // $(this.refs.input.getDOMNode()).show().focus();
    // $(this.refs.label.getDOMNode()).hide();
    $(this.refs.label.getDOMNode()).attr('contenteditable', 'true').focus();
  },
  submitHandler: function(e){
    if(e.keyCode == 13){
      e.preventDefault();
      this.saveContent();
      return;
    }
  },
  saveContent: function(){
    $(this.refs.label.getDOMNode()).removeAttr('contenteditable');
    console.log("have to save now");
  },
  render: function(){
    // <input className="input-name" defaultValue={this.props.page.pageName} ref="input" onKeyUp={this.submitHandler}></input>
    var isSelected = this.props.page.isSelected ? 'selected' : '';
    return (
      <div className={isSelected + " page" } ref="pageButton" onClick={this.onPageButtonClick}>
        <span className="name input-name" ref="label" onBlur={this.saveContent} onKeyDown={this.submitHandler}>{this.props.page.pageName}</span>
        <span className="icon delete" onClick={this.deletePage} onMouseOver={this.beforeDelete} onMouseOut={this.backToNormal}></span>
        <span className="icon edit" onClick={this.editPage}></span>
      </div>
    );
  }
})

var SideBarTemplates = React.createClass({
  getInitialState: function(){
    return {pages: this.props.pages};
  },
  componentDidMount: function(){
    this.props.onPageUpdate(this.state.pages);
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
  deletePage: function(child){
    var pages = this.state.pages;
    var position = pages.indexOf(pages.filter(function(v,i){ return v.pageID == child.props.page.pageID })[0]);
    this.state.pages.splice(position, 1);
    this.forceUpdate();
    this.props.onPageUpdate(this.state.pages);
  },
  togglePageButton: function(child){
    var self = this;
    this.state.pages.forEach(function(page, i){
      self.state.pages[i].isSelected = false;
      if(page.pageID == child.props.page.pageID){
        self.state.pages[i].isSelected = true;
      }
    });
    this.setState({selectedPage: child.props.page.pageID});
    this.props.onPageUpdate(this.state.pages);
    // call navigator
    // this.forceUpdate();
  },
  addPage: function(){

    var pageName = this.refs.input.getDOMNode().value;
    if(!pageName) return;

    this.state.pages.push({pageName: pageName, pageID: GUID(), isSelected: false});
    this.refs.input.getDOMNode().value = '';
    this.forceUpdate();
    this.props.onPageUpdate(this.state.pages);
  
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
              {this.state.pages.map(function(page, i){
                return (
                  <li key={i}>
                    <SideBarTemplatesPages 
                      onClick={self.togglePageButton}
                      onDelete={self.deletePage} 
                      page={page} />
                    </li>
                  );
              })}
            </ul>
            <div id="add-page">
              <form onSubmit={this.formSubmit} onMouseOut={this.onMouseOut} onMouseOver={this.onMouseOver}>
                <input type="text" className="input" placeholder="add new page" ref="input" onFocus={this.onMouseOver} onBlur={this.onMouseOut}/>
                <span className="icon add" onClick={this.addPage} ref="addButton"></span>
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
                <span className={checkboxState + " checkbox"} onClick={this.toggleCheckBox}></span>
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
        <SideBarTemplates onPageUpdate={this.onPageUpdate} pages={this.props.pages}/>
        <SideBarElements />
        <SideBarSettings />
      </div>
    );
  }
});

var EditorPageNavigation = React.createClass({

  updatePageNavigation: function(pages){
    this.props.pages = pages;
    this.forceUpdate();
  },
  render: function(){
    var pages = this.props.pages || [];
    return (
      <div id="page-navigation">
        <ul>
          {pages.map(function(page){
            return (
              <li className="page-container">
                <div className={(page.isSelected == true? 'selected' : '') + " page"}>
                  <span className="name">{page.pageName}</span>
                </div>
              </li>
            );
          })}
        </ul>
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
    var node = $(e.currentTarget);
    var elementID = node.closest('li').data('element-id');
    var parentID = node.closest('ul').data('parent-id');
    this.props.onDelete(elementID, parentID);
  }
};

var TitleElement = React.createClass({
  mixins: [ElementEventsMixin],
  getInitialState: function(){
    return {el: this.props.el};
  },
  saveContent: function(e){
    var el = this.state.el;
    el.props.content = e.target.value;
    // this.setState({el: el});
    this.props.onUpdate(this.elementID, this.parentID, this.state.el);
  },
  render: function(){
    return (
      <div className="editor-element editor-element-title">
        <div className="controls">
          <div className="editor-element-handle left-handle"></div>
          <div className="editor-element-handle right-handle"></div>
          <div className="editor-element-handle bottom-handle"></div>
          <div className="delete"></div>
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
    // this.setState({el: el});
    this.props.onUpdate(this.elementID, this.parentID, this.state.el);
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
          <div className="delete"></div>
        </div>
        <div className="image-element">
          <div className="image"></div>
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
          <div className="delete"></div>
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
    return nextState.shouldUpdate;
  },

  onElementUpdate: function(elementID, parentID, el){
    var elements = this.state.elements;
    if(parentID != null){
      elements[parentID][elementID] = el;
    }else{
      elements[elementID] = el;
    }

    this.setState({
      shouldUpdate: false,
      elements: elements
    });

  },

  onElementDelete: function(elementID, parentID){

    var elements = this.state.elements;
    if(parentID != null){
      elements[parentID].splice(elementID, 1);
    }else{
      elements.splice(elementID, 1);
    }

    this.setState({
      shouldUpdate: true,
      elements: elements
    });

  },
  renderElement: function(el){
    var elType = el.type;
    var content = el.props.content;
    if(elType == 1){
      return (<TitleElement el={el} onUpdate={this.onElementUpdate} onDelete={this.onElementDelete}/>);
    }else if(elType == 2){
      return (<TextElement el={el} onUpdate={this.onElementUpdate} onDelete={this.onElementDelete}/>);
    }else if(elType == 3){
      return (<ImageElement onUpdate={this.onElementUpdate} onDelete={this.onElementDelete}/>);
    }else{
      return (<NavElement onUpdate={this.onElementUpdate} onDelete={this.onElementDelete}/>);
    }
  },
  componentDidMount: function(){
    this.enableSorting();
  },
  componentDidUpdate: function(){
    this.enableSorting();
  },
  enableSorting: function(){
    var self = this;
    var stateElements = this.state.elements;

    this.sort = $(".sort").sortable({
      forcePlaceholderSize: true,
      tolerance: "pointer",
      handle: '.editor-element-handle',
      revert: 1,
      connectWith: ".sort",
      dropOnEmpty: true,
      placeholder: {
        element: function(currentItem) {
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
            props: {
              content : ''
            }
          };

          if(category != null){
            elements[category].splice(position, 0, el); 
          }else{
            elements.splice(position, 0, [el]);
          }
          
          ui.item.remove();
          // self.sort.sortable('cancel');

          self.setState({
            shouldUpdate: true,
            elements: elements
          }, function(){
            // self.enableSorting();
          });

        }else if(ui.item.hasClass('sort-item')){
          var targetPosition = position;
          var targetParent = category;
          var sourcePosition = ui.item.data('element-id');
          var sourceParent = ui.item.data('parent-id');

          if(targetParent == undefined){
            targetParent = 0;
            elements.splice(targetParent, 0, [elements[sourceParent].splice(sourcePosition, 1)[0]]);
          }else{
            elements[targetParent].splice(targetPosition, 0, elements[sourceParent].splice(sourcePosition, 1)[0]);
          }
          
          ui.item.remove();
          self.sort.sortable('cancel');

          self.setState({
            shouldUpdate: true,
            elements: elements
          }, function(){
            // self.enableSorting();
          });
        }
      }
    });
  },
  render: function(){
    var self = this;  
    var elements = $.map(this.state.elements,function(item, index1){
      return (
        <li className="sort-item">
          <ul className="sort horizontal" data-id="2" data-parent-id={index1} data-length={item.length}>
            {item.map(function(el, index2){
              var style = {
                width: Math.floor(95/item.length) + '%'
              };
              return (
                <ListItem render={self.renderElement} style={style} index1={index1} index2={index2} el={el} />
              );  
            })}
          </ul>
        </li>
      );
    });



    return (
      <div className="page-content">
        <ul className="sort vertical" data-id="1" data-length={elements.length} key={elements.length}>
          {elements}
        </ul>
      </div>
    );
  }
});

var ListItem = React.createClass({
  render: function(){
    return (
      <li className="sort-item" style={this.props.style} data-element-id={this.props.index2} data-parent-id={this.props.index1}>
        {this.props.render(this.props.el)}
      </li>
    );
  }
})

var Editor = React.createClass({

  getInitialState: function(){
    return this.props.pages[0];
  },

  updatePageNavigation: function(pages){
    this.refs.editorNavigation.updatePageNavigation(pages);
  },

  render: function(){
    return (
      <div id="editor">
        <EditorPageNavigation ref="editorNavigation" pages={this.props.pages}/>
        <EditorContent elements={this.props.pages[0].pageContent}/>
      </div>
    );
  }
});

var Application = React.createClass({
  getInitialState: function(){
    var pid = GUID();
    return {
      app: {
        pages: [{
            pageName: 'Home',
            pageID: pid,
            isSelected: true,
            pageContent: {
                elements: [
                    [{
                        type: '2',
                        props: {
                            content: ''
                        }
                    }]
                ]
            }
        }]
      }
    };
  },
  onPageUpdate: function(pages){
    this.refs.editor.updatePageNavigation(pages);
  },
  render: function(){
    return (
      <div>
        <Header {...this.state}/>
        <SideBar onPageUpdate={this.onPageUpdate} pages={this.state.app.pages}/>
        <Editor ref="editor" pages={this.state.app.pages}/>
      </div>
    );
  }
});

React.render(<Application />, document.getElementById("main"));

function GUID(){
  return Math.random().toString(36).substring(7);
}