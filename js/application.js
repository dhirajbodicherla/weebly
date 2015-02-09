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

var SideBarTemplatesPage = React.createClass({displayName: "SideBarTemplatesPage",
  getInitialState: function(){
    return {page: this.props.page};
  },
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
    this.state.page.isSelected = true;
    this.props.onClick(this);
  },
  editPage: function(e){
    $(this.refs.label.getDOMNode()).text(this.state.page.pageName).attr('contenteditable', 'true').addClass('editing').focus();
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
      e.stopPropagation();
    }
  },
  saveContent: function(){
    $(this.refs.label.getDOMNode()).removeAttr('contenteditable').removeClass('editing');
    var page = this.state.page;
    var self = this;
    page.pageName = this.refs.label.getDOMNode().innerText
    this.setState({
      page: page
    }, function(){
      self.props.onPageUpdate(self);
    });
  },
  render: function(){
    var isSelected = this.state.page.isSelected ? 'selected' : '';
    var pageName = this.state.page.pageName;
    pageName = pageName.length > 6 ? pageName.substring(0, 6) + '...' : pageName;
    return (
      React.createElement("div", {className: isSelected + " page", 
            ref: "pageButton", 
            onClick: this.onPageButtonClick, 
            title: this.state.page.pageName}, 
        React.createElement("span", {className: "name input-name", 
              ref: "label", 
              onClick: this.preventSelection, 
              onKeyDown: this.submitHandler, 
              key: GUID()}, 
              pageName
        ), 
        React.createElement("span", {className: "icon delete", 
              onClick: this.deletePage, 
              onMouseOver: this.beforeDelete, 
              onMouseOut: this.backToNormal}
        ), 
        React.createElement("span", {className: "icon edit", 
              onClick: this.editPage}
        )
      )
    );
  }
});

var SideBarTemplates = React.createClass({displayName: "SideBarTemplates",
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
      React.createElement("div", {className: "item", id: "templates"}, 
        React.createElement("div", {className: "divider"}, 
          "Templates"
        ), 
        React.createElement("div", {className: "content"}, 
          React.createElement("div", {className: "pages"}, 
            React.createElement("ul", null, 
              this.props.pages.map(function(page, i){
                return (
                  React.createElement("li", {key: i}, 
                    React.createElement(SideBarTemplatesPage, {
                      onClick: self.togglePageButton, 
                      onDelete: self.deletePage, 
                      page: page, 
                      onPageUpdate: self.pageUpdate})
                    )
                  );
              })
            ), 
            React.createElement("div", {id: "add-page"}, 
              React.createElement("form", {onSubmit: this.formSubmit, 
                    onMouseOut: this.onMouseOut, 
                    onMouseOver: this.onMouseOver}, 
                React.createElement("input", {type: "text", 
                      className: "input", 
                      placeholder: "add new page", 
                      ref: "input", 
                      onFocus: this.onMouseOver, 
                      onBlur: this.onMouseOut}), 
                React.createElement("span", {className: "icon add", 
                      onClick: this.addPage, 
                      ref: "addButton"}
                )
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
                React.createElement("span", {className: checkboxState + " checkbox icon-Toggle-Switch", onClick: this.toggleCheckBox})
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
        React.createElement(SideBarTemplates, {onPageUpdate: this.onPageUpdate, 
                          pages: this.props.pages}), 
        React.createElement(SideBarElements, null), 
        React.createElement(SideBarSettings, null)
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
    var node = $(this.getDOMNode()).closest('li.sort-item');
    var location = node.data('location').split('-');
    var elementID = location[1];
    var parentID = location[0];
    
    this.props.onDelete(elementID, parentID);
  }
};

var TitleElement = React.createClass({displayName: "TitleElement",
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
      React.createElement("div", {className: "editor-element editor-element-title"}, 
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

var TextElement = React.createClass({displayName: "TextElement",
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
          React.createElement("div", {className: "delete", onMouseOver: this.deleteMouseOver, onMouseOut: this.deleteMouseOut, onClick: this.deleteOnClick})
        ), 
        React.createElement("div", {className: "image-element"}, 
          React.createElement("div", {className: "image-placeholder icon-Image-Placeholder"}), 
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
          React.createElement("div", {className: "delete", onMouseOver: this.deleteMouseOver, onMouseOut: this.deleteMouseOut, onClick: this.deleteOnClick})
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
        element = (React.createElement(TitleElement, {el: el, 
                                    onUpdate: this.onElementUpdate, 
                                    onDelete: this.onElementDelete}));
        break;
      case 2:
        element = (React.createElement(TextElement, {el: el, 
                                onUpdate: this.onElementUpdate, 
                                onDelete: this.onElementDelete}));
        break;
      case 3:
        element = (React.createElement(ImageElement, {el: el, 
                                  onUpdate: this.onElementUpdate, 
                                  onDelete: this.onElementDelete}));
        break;
      case 4:
        element = (React.createElement(NavElement, {el: el, 
                                onUpdate: this.onElementUpdate, 
                                onDelete: this.onElementDelete}));
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
        React.createElement("li", {className: "sort-item", key: index1}, 
          React.createElement("ul", {className: "sort horizontal", "data-id": "2", "data-parent-id": index1, "data-length": item.length}, 
            item.map(function(el, index2){
              var style = {
                width: Math.floor(95/item.length) + '%'
              };
              return (
                React.createElement(ListItem, {render: self.renderElement, style: style, index1: index1, index2: index2, el: el, key: el.id})
              );  
            })
          )
        )
      );
    });

    return (
      React.createElement("div", {className: "page-content"}, 
        React.createElement("ul", {className: "sort vertical", "data-id": "1", "data-length": elements.length}, 
          elements
        )
      )
    );
  }

});

var ListItem = React.createClass({displayName: "ListItem",
  render: function(){
    return (
      React.createElement("li", {className: "sort-item", 
          style: this.props.style, 
          "data-element-id": this.props.index2, 
          "data-parent-id": this.props.index1, 
          "data-location": this.props.index1 + '-' + this.props.index2}, 
        this.props.render(this.props.el)
      )
    );
  }
});

var EditorPageNavigation = React.createClass({displayName: "EditorPageNavigation",
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
      React.createElement("div", {id: "page-navigation"}, 
        React.createElement("ul", null, 
          pages.map(function(page, i){
            var pageName = page.pageName.length > 9 ? page.pageName.substring(0,9) + '...' : page.pageName;
            return (
              React.createElement("li", {className: "page-container", 
                  onClick: self.onPageSelect.bind(this, page, i), 
                  key: i, 
                  title: page.pageName}, 
                React.createElement("div", {className: (page.isSelected == true? 'selected' : '') + " page"}, 
                  React.createElement("span", {className: "name"}, pageName)
                )
              )
            );
          }, this)
        )
      )
    );
  }
});

var Editor = React.createClass({displayName: "Editor",

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
      React.createElement("div", {id: "editor"}, 
        React.createElement(EditorPageNavigation, {ref: "editorPageNavigation", 
                              pages: this.state.pages, 
                              onPageSelect: this.pageSelect}), 
        React.createElement(EditorContent, {ref: "editorContent", 
                        elements: this.state.pages[this.currentPageIndex].pageContent, 
                        onUpdate: this.onUpdate})
      )
    );
  }
});

var Application = React.createClass({displayName: "Application",
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
      React.createElement("div", null, 
        React.createElement(Header, null), 
        React.createElement(SideBar, {
          onPageUpdate: this.onPageUpdate, 
          pages: this.props.pages}), 
        React.createElement(Editor, {
          ref: "editor", 
          pages: this.props.pages})
      )
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
  


React.render(React.createElement(Application, {pages: Pages}), document.getElementById("main"));

function GUID(){
  return Math.random().toString(36).substring(7);
}