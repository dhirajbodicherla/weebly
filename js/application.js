var Navigation = React.createClass({
  render: function(){
    return (
      <div className="nav">
        <div className="bg"></div>
        <div className="logomark"></div>
        <div className="publish">Save & Publish</div>
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
  render: function(){
    var isSelected = this.props.page.isSelected ? 'selected' : '';
    return (
      <div className={isSelected + " page" } ref="pageButton" onClick={this.onPageButtonClick}>
        <span className="name">{this.props.page.pageName}</span>
        <span className="icon delete" onClick={this.deletePage} onMouseOver={this.beforeDelete} onMouseOut={this.backToNormal}></span>
        <span className="icon edit"></span>
      </div>
    );
  }
})

var SideBarTemplates = React.createClass({
  getInitialState: function(){
    var page = [{
      pageName: 'Home', 
      pageID: GUID(),
      isSelected: true
    }];
    return {
      pages: page,
      selectedPage: page[0].pageID
    };
  },
  componentDidMount: function(){
    this.props.onPageUpdate(this.state.pages);
  },
  formSubmit: function(e){
    e.preventDefault();
    this.addPage();
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
      <div className="templates item">
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
            <div className="add-page">
              <form onSubmit={this.formSubmit}>
                <input type="text" className="input" placeholder="add new page" ref="input"/>
                <span className="icon add" onClick={this.addPage}></span>
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
    $('.elements .element .image').draggable({
      connectToSortable: ".sort",
      helper: function(){
        return React.renderToString(React.createElement('div', {className: $(this).attr('class')}, null));
      },
      revert: "invalid",
      revertDuration: 200,
      start: function(){
        // $('.editor .content').toggleClass('editing');
      },
      stop: function(event, ui){
        // $('.editor .content').toggleClass('editing');
      }
    });
  },
  render: function(){
    return (
      <div className="elements item">
        <div className="divider">
          Elements
        </div>
        <div className="content">
          <ul>
            <li><SideBarElementsIcons typeID="1" typeName="title-icon" typeDisplay="Title" /></li>
            <li><SideBarElementsIcons typeID="2" typeName="text-icon" typeDisplay="Text" /></li>
            <li><SideBarElementsIcons typeID="3" typeName="img-icon" typeDisplay="Image" /></li>
            <li><SideBarElementsIcons typeID="4" typeName="nav-icon" typeDisplay="Nav" /></li>
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
      <div className="settings item">
        <div className="divider">
          Settings
        </div>
        <div className="content">
          <ul>
            <li>
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
      <div className="sidebar">
        <div className="bg"></div>
        <SideBarTemplates onPageUpdate={this.onPageUpdate}/>
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
      <div className="navigation">
        <ul>
          {pages.map(function(page){
            return (
              <li>
                <div className="page">
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

var TitleElement = React.createClass({
  componentDidMount: function(){
    var self = this;
    var node = $(this.getDOMNode());
    var elementID = node.closest('li').data('element-id');
    var parentID = node.closest('ul').data('parent-id');

    $(this.getDOMNode()).on('mouseenter', '.delete', function(e){
      $(this).siblings().hide();
      $(this).closest('.editor-element').addClass('delete');
    }).on('mouseleave', '.delete', function(e){
      $(this).siblings().show();
      $(this).closest('.editor-element').removeClass('delete');
    }).on('click', '.delete', function(e){
      self.props.onDelete(elementID, parentID);
    });
  },
  render: function(){
    return (
      <div className='editor-element editor-element-title'>
        <div className="controls">
          <div className="left-handle"></div>
          <div className="right-handle"></div>
          <div className="bottom-handle"></div>
          <div className="delete"></div>
        </div>
        <p className="placeholder">
          {(this.props.content == '') ? "Start typing here" : this.props.content}
        </p>
      </div>
    );
  }
});

var TextElement = React.createClass({
  getInitialState: function(){
    return {el: this.props.el};
  },
  componentDidMount: function(){
    var self = this;
    var node = $(this.getDOMNode());
    this.elementID = node.closest('li').data('element-id');
    this.parentID = node.closest('ul').data('parent-id');

    $(this.getDOMNode()).on('mouseenter', '.delete', function(e){
      $(this).siblings().hide();
      $(this).closest('.editor-element').addClass('delete');
    }).on('mouseleave', '.delete', function(e){
      $(this).siblings().show();
      $(this).closest('.editor-element').removeClass('delete');
    }).on('click', '.delete', function(e){
      self.props.onDelete(self.elementID, self.parentID);
    });

  },

  saveContent: function(e){
    var el = this.state.el;
    el.content = e.target.value;
    // this.setState({el: el});
    this.props.onUpdate(this.elementID, this.parentID, this.state.el);
  },

  render: function(){
    return (
      <div className='editor-element editor-element-text'>
        <div className="controls">
          <div className="left-handle"></div>
          <div className="right-handle"></div>
          <div className="bottom-handle"></div>
          <div className="delete"></div>
        </div>
        <textarea type="text" className="input"
                  placeholder="Start typing here" 
                  defaultValue={this.state.el.content}
                  onKeyUp={this.saveContent}>
        </textarea>
      </div>
    );
  }
});

var ImageElement = React.createClass({
  componentDidMount: function(){
    var self = this;
    var node = $(this.getDOMNode());
    var elementID = node.closest('li').data('element-id');
    var parentID = node.closest('ul').data('parent-id');

    $(this.getDOMNode()).on('mouseenter', '.delete', function(e){
      $(this).siblings().hide();
      $(this).closest('.editor-element').addClass('delete');
    }).on('mouseleave', '.delete', function(e){
      $(this).siblings().show();
      $(this).closest('.editor-element').removeClass('delete');
    }).on('click', '.delete', function(e){
      self.props.onDelete(elementID, parentID);
    });
  },
  render: function(){
    return (
      <div className='editor-element editor-element-image'>
        <div className="controls">
          <div className="left-handle"></div>
          <div className="right-handle"></div>
          <div className="bottom-handle"></div>
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
  componentDidMount: function(){
    var self = this;
    var node = $(this.getDOMNode());
    var elementID = node.closest('li').data('element-id');
    var parentID = node.closest('ul').data('parent-id');

    node.on('mouseenter', '.delete', function(e){
      $(this).siblings().hide();
      $(this).closest('.editor-element').addClass('delete');
    }).on('mouseleave', '.delete', function(e){
      $(this).siblings().show();
      $(this).closest('.editor-element').removeClass('delete');
    }).on('click', '.delete', function(e){
      self.props.onDelete(elementID, parentID);
    });
  },
  render: function(){
    return (
      <div className='editor-element editor-element-nav'>
        <div className="controls">
          <div className="left-handle"></div>
          <div className="right-handle"></div>
          <div className="bottom-handle"></div>
          <div className="delete"></div>
        </div>
        <p className="placeholder">Nav</p>
      </div>
    );
  }
});

var EditorContent = React.createClass({
  getInitialState: function() {
    return {
      elements: [
        [
          {
            type: '3',
            props: {
              content: ''
            }
          }
        ]
      ]
    };
  },
  shouldComponentUpdate: function(nextProps, nextState){
    return nextState.shouldUpdate;
  },

  onElementUpdate: function(elementID, parentID, el){
    // console.log('onElementUpdate');
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
    var self = this;
    var stateElements = this.state.elements;

    $(this.getDOMNode()).find('.sort').sortable({
      forceHelperSize: true,
      forcePlaceholderSize: true,
      revert: 50,
      // scroll: false,
      scrollSensitivity: 1,
      connectWith: '.sort',
      cursorAt: { left: 5 },
      dropOnEmpty: true,
      placeholder: "editor-element-placeholder",
      over: function(event, ui){
        // $('.editor .content').addClass('editing');
      },
      out: function(){
        // $('.editor .content').removeClass('editing');
      },
      placeholder: {
        element: function(currentItem) {
          var parent = $(this).closest('ul'), height = '1px';
          if(parent.data('parent-id') != null){
            height = parent.height() + 'px';
          }else{
            height = '1px';
          }
          return $("<li class='editor-element-placeholder'></li>").css({height: height})[0];
        },
        update: function(container, p) {
          return;
        }
      },
      stop: function(event, ui){
        if(ui.item.hasClass('image')){

          var position = ui.item.index();
          var category = ui.item.closest('ul').data('parent-id');
          var elements = self.state.elements;
       
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

          self.setState({
            shouldUpdate: true,
            elements: elements
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
          <ul className="sort horizontal" data-id="2" data-parent-id={index1}>
            {item.map(function(el, index2){
              var style = {
                width: Math.floor(96/item.length) + '%'
              };
              return (
                <li className="sort-item" style={style} data-element-id={index2}>
                  {self.renderElement(el)}
                </li>
              );  
            })}
          </ul>
        </li>
      );
    });

    return (
      <div className="content">
        <ul className="sort vertical" data-id="1">
          {elements}
        </ul>
      </div>
    );
  }
})

var Editor = React.createClass({
  
  updatePageNavigation: function(pages){
    this.refs.editorNavigation.updatePageNavigation(pages);
  },

  render: function(){
    return (
      <div className="editor">
        <EditorPageNavigation ref="editorNavigation"/>
        <EditorContent />
      </div>
    );
  }
});

var Application = React.createClass({
  onPageUpdate: function(pages){
    this.refs.editor.updatePageNavigation(pages);
  },
  render: function(){
    return (
      <div>
        <Navigation />
        <SideBar onPageUpdate={this.onPageUpdate}/>
        <Editor ref="editor"/>
      </div>
    );
  }
});

React.render(<Application />, document.getElementById("body"));

function GUID(){
  return Math.random().toString(36).substring(7);
}