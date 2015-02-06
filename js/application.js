
var Header = React.createClass({displayName: "Header",
  render: function(){
    return (
      React.createElement("div", {id: "header"}, 
        React.createElement("div", {className: "bg"}), 
        React.createElement("div", {id: "logomark", className: "icon-Weebly-Logo"})
      )
    );
  }
});

var SideBarTemplatesPages = React.createClass({displayName: "SideBarTemplatesPages",
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
      React.createElement("div", {className: isSelected + " page", ref: "pageButton", onClick: this.onPageButtonClick}, 
        React.createElement("span", {className: "name input-name", ref: "label", onBlur: this.saveContent, onKeyDown: this.submitHandler}, this.props.page.pageName), 
        React.createElement("span", {className: "icon delete", onClick: this.deletePage, onMouseOver: this.beforeDelete, onMouseOut: this.backToNormal}), 
        React.createElement("span", {className: "icon edit", onClick: this.editPage})
      )
    );
  }
})

var SideBarTemplates = React.createClass({displayName: "SideBarTemplates",
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
      React.createElement("div", {className: "item", id: "templates"}, 
        React.createElement("div", {className: "divider"}, 
          "Templates"
        ), 
        React.createElement("div", {className: "content"}, 
          React.createElement("div", {className: "pages"}, 
            React.createElement("ul", null, 
              this.state.pages.map(function(page, i){
                return (
                  React.createElement("li", {key: i}, 
                    React.createElement(SideBarTemplatesPages, {
                      onClick: self.togglePageButton, 
                      onDelete: self.deletePage, 
                      page: page})
                    )
                  );
              })
            ), 
            React.createElement("div", {id: "add-page"}, 
              React.createElement("form", {onSubmit: this.formSubmit, onMouseOut: this.onMouseOut, onMouseOver: this.onMouseOver}, 
                React.createElement("input", {type: "text", className: "input", placeholder: "add new page", ref: "input", onFocus: this.onMouseOver, onBlur: this.onMouseOut}), 
                React.createElement("span", {className: "icon add", onClick: this.addPage, ref: "addButton"})
              )
            )
          )
        )
      )
    );
  }
});

var SideBarElementsIcons = React.createClass({displayName: "SideBarElementsIcons",
  render: function(){
    return (
      React.createElement("div", {className: "element"}, 
        React.createElement("div", {className: this.props.typeName + " image", "data-type": this.props.typeID}), 
        React.createElement("div", {className: "label"}, this.props.typeDisplay)
      )
    );
  }
})

var SideBarElements = React.createClass({displayName: "SideBarElements",
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
      React.createElement("div", {className: "item", id: "elements"}, 
        React.createElement("div", {className: "divider"}, 
          "Elements"
        ), 
        React.createElement("div", {className: "content"}, 
          React.createElement("ul", null, 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcons, {typeID: "1", typeName: "title-icon", typeDisplay: "Title"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcons, {typeID: "2", typeName: "text-icon", typeDisplay: "Text"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcons, {typeID: "3", typeName: "img-icon", typeDisplay: "Image"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcons, {typeID: "4", typeName: "nav-icon", typeDisplay: "Nav"})
            )
          ), 
          React.createElement("div", {className: "clearfix"})
        )
      )
    );
  }
});

var SideBarSettings = React.createClass({displayName: "SideBarSettings",
  getInitialState: function() {
    return {isChecked: false};
  },
  toggleCheckBox: function(){
    this.setState({isChecked : !this.state.isChecked});
  },
  render: function(){
    var checkboxState = this.state.isChecked ? 'checked' : '';
    return (
      React.createElement("div", {className: "item", id: "settings"}, 
        React.createElement("div", {className: "divider"}, 
          "Settings"
        ), 
        React.createElement("div", {className: "content"}, 
          React.createElement("ul", null, 
            React.createElement("li", {className: "settings-item-container"}, 
              React.createElement("div", {className: "settings-item site-grid"}, 
                "site grid", 
                React.createElement("span", {className: checkboxState + " checkbox", onClick: this.toggleCheckBox})
              )
            )
          )
        )
      )
    );
  }
});

var SideBar = React.createClass({displayName: "SideBar",
  onPageUpdate: function(pages){
    this.props.onPageUpdate(pages);
  },
  render: function(){
    return (
      React.createElement("div", {id: "sidebar"}, 
        React.createElement(SideBarTemplates, {onPageUpdate: this.onPageUpdate, pages: this.props.pages}), 
        React.createElement(SideBarElements, null), 
        React.createElement(SideBarSettings, null)
      )
    );
  }
});

var EditorPageNavigation = React.createClass({displayName: "EditorPageNavigation",

  updatePageNavigation: function(pages){
    this.props.pages = pages;
    this.forceUpdate();
  },
  render: function(){
    var pages = this.props.pages || [];
    return (
      React.createElement("div", {id: "page-navigation"}, 
        React.createElement("ul", null, 
          pages.map(function(page){
            return (
              React.createElement("li", {className: "page-container"}, 
                React.createElement("div", {className: (page.isSelected == true? 'selected' : '') + " page"}, 
                  React.createElement("span", {className: "name"}, page.pageName)
                )
              )
            );
          })
        )
      )
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

var TitleElement = React.createClass({displayName: "TitleElement",
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
      React.createElement("div", {className: "editor-element editor-element-title"}, 
        React.createElement("div", {className: "controls"}, 
          React.createElement("div", {className: "editor-element-handle left-handle"}), 
          React.createElement("div", {className: "editor-element-handle right-handle"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle"}), 
          React.createElement("div", {className: "delete"})
        ), 
        React.createElement("textarea", {type: "text", className: "input", 
                placeholder: "Start typing here", 
                defaultValue: this.state.el.props.content, 
                onKeyUp: this.saveContent}
        )
      )
    );
  }
});

var TextElement = React.createClass({displayName: "TextElement",
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
      React.createElement("div", {className: "editor-element editor-element-text"}, 
        React.createElement("div", {className: "controls"}, 
          React.createElement("div", {className: "editor-element-handle left-handle"}), 
          React.createElement("div", {className: "editor-element-handle right-handle"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle"}), 
          React.createElement("div", {className: "delete", onMouseOver: this.deleteMouseOver, onMouseOut: this.deleteMouseOut, onClick: this.deleteOnClick})
        ), 
        React.createElement("textarea", {type: "text", className: "input", 
                  placeholder: "Start typing here", 
                  defaultValue: this.state.el.props.content, 
                  onKeyUp: this.saveContent}
        )
      )
    );
  }
});

var ImageElement = React.createClass({displayName: "ImageElement",
  mixins: [ElementEventsMixin],
  render: function(){
    return (
      React.createElement("div", {className: "editor-element editor-element-image"}, 
        React.createElement("div", {className: "controls"}, 
          React.createElement("div", {className: "editor-element-handle left-handle"}), 
          React.createElement("div", {className: "editor-element-handle right-handle"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle"}), 
          React.createElement("div", {className: "delete"})
        ), 
        React.createElement("div", {className: "image-element"}, 
          React.createElement("div", {className: "image"}), 
          React.createElement("div", {className: "label"}, "add image +")
        )
      )
    );
  }
});

var NavElement = React.createClass({displayName: "NavElement",
  mixins: [ElementEventsMixin],
  render: function(){
    return (
      React.createElement("div", {className: "editor-element editor-element-nav"}, 
        React.createElement("div", {className: "controls"}, 
          React.createElement("div", {className: "editor-element-handle left-handle"}), 
          React.createElement("div", {className: "editor-element-handle right-handle"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle"}), 
          React.createElement("div", {className: "delete"})
        ), 
        React.createElement("p", {className: "placeholder"}, "Nav")
      )
    );
  }
});

var EditorContent = React.createClass({displayName: "EditorContent",
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
      return (React.createElement(TitleElement, {el: el, onUpdate: this.onElementUpdate, onDelete: this.onElementDelete}));
    }else if(elType == 2){
      return (React.createElement(TextElement, {el: el, onUpdate: this.onElementUpdate, onDelete: this.onElementDelete}));
    }else if(elType == 3){
      return (React.createElement(ImageElement, {onUpdate: this.onElementUpdate, onDelete: this.onElementDelete}));
    }else{
      return (React.createElement(NavElement, {onUpdate: this.onElementUpdate, onDelete: this.onElementDelete}));
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
        React.createElement("li", {className: "sort-item"}, 
          React.createElement("ul", {className: "sort horizontal", "data-id": "2", "data-parent-id": index1, "data-length": item.length}, 
            item.map(function(el, index2){
              var style = {
                width: Math.floor(95/item.length) + '%'
              };
              return (
                React.createElement(ListItem, {render: self.renderElement, style: style, index1: index1, index2: index2, el: el})
              );  
            })
          )
        )
      );
    });



    return (
      React.createElement("div", {className: "page-content"}, 
        React.createElement("ul", {className: "sort vertical", "data-id": "1", "data-length": elements.length, key: elements.length}, 
          elements
        )
      )
    );
  }
});

var ListItem = React.createClass({displayName: "ListItem",
  render: function(){
    return (
      React.createElement("li", {className: "sort-item", style: this.props.style, "data-element-id": this.props.index2, "data-parent-id": this.props.index1}, 
        this.props.render(this.props.el)
      )
    );
  }
})

var Editor = React.createClass({displayName: "Editor",

  getInitialState: function(){
    return this.props.pages[0];
  },

  updatePageNavigation: function(pages){
    this.refs.editorNavigation.updatePageNavigation(pages);
  },

  render: function(){
    return (
      React.createElement("div", {id: "editor"}, 
        React.createElement(EditorPageNavigation, {ref: "editorNavigation", pages: this.props.pages}), 
        React.createElement(EditorContent, {elements: this.props.pages[0].pageContent})
      )
    );
  }
});

var Application = React.createClass({displayName: "Application",
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
      React.createElement("div", null, 
        React.createElement(Header, React.__spread({},  this.state)), 
        React.createElement(SideBar, {onPageUpdate: this.onPageUpdate, pages: this.state.app.pages}), 
        React.createElement(Editor, {ref: "editor", pages: this.state.app.pages})
      )
    );
  }
});

React.render(React.createElement(Application, null), document.getElementById("main"));

function GUID(){
  return Math.random().toString(36).substring(7);
}