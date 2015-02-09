var Header = React.createClass({displayName: "Header",
  render: function(){
    return (
      React.createElement("div", {id: "header"}, 
        React.createElement("div", {id: "logomark", className: "icon-Weebly-Logo"})
      )
    );
  }
});

var SideBarTemplatesPage = React.createClass({displayName: "SideBarTemplatesPage",
  getInitialState: function(){
    return {page: this.props.page};
  },
  pageNormal: function(){
    $(this.refs.pageButton.getDOMNode()).removeClass('delete');
  },
  pageDeleteHover: function(){
    $(this.refs.pageButton.getDOMNode()).addClass('delete');    
  },
  deleteClickHandler: function(e){
    this.props.onDelete(this);
    e.stopPropagation();
  },
  onPageButtonClick: function(){
    return;
    /* NOTE: Click should not do anything for now */
    var page = this.state.page;
    page.isSelected = true;
    this.setState({
      page: page
    });
    this.props.onClick(this);
  },
  editClickHandler: function(e){
    $(this.refs.label.getDOMNode())
      .text(this.state.page.pageName)
      .attr('contenteditable', 'true')
      .addClass('editing').focus();

    e.stopPropagation();
  },
  inputNameClickHandler: function(e){
    /* 
      This is only used to stop propagation 
      when input is clicked while editing.
      Will stop event to avoid page being selected while editing
    */
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
    var page = this.state.page;
    var self = this;

    $(this.refs.label.getDOMNode())
      .removeAttr('contenteditable')
      .removeClass('editing');
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
    pageName = pageName.length > 11 ? pageName.substring(0, 8) + '...' : pageName;
    return (
      React.createElement("div", {className: isSelected + " page", 
            ref: "pageButton", 
            onClick: this.onPageButtonClick, 
            title: this.state.page.pageName}, 
        React.createElement("span", {className: "name input-name", 
              ref: "label", 
              onClick: this.inputNameClickHandler, 
              onKeyDown: this.submitHandler, 
              key: GUID()}, 
              pageName
        ), 
        React.createElement("span", {className: "icon delete icon-Add-Delete-Edit-Icons", 
              onClick: this.deleteClickHandler, 
              onMouseOver: this.pageDeleteHover, 
              onMouseOut: this.pageNormal}
        ), 
        React.createElement("span", {className: "icon edit icon-Add-Delete-Edit-Icons", 
              onClick: this.editClickHandler}
        )
      )
    );
  }
});

var SideBarTemplates = React.createClass({displayName: "SideBarTemplates",
  componentDidMount: function(){
    // this.props.onPageUpdate(this.props.pages);
  },
  formSubmitHandler: function(e){
    e.preventDefault();
    this.addClickHandler();
  },
  inputFocus: function(){
    $(this.refs.addButton.getDOMNode()).removeClass('hover');
  },
  inputBlur: function(){
    $(this.refs.addButton.getDOMNode()).addClass('hover');
  },
  addClickHandler: function(){
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
    return;
    /* NOTE: Click should not do anything for now */
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
  pageUpdateHandler: function(child){
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
                  React.createElement("li", {key: page.pageID + '-pages'}, 
                    React.createElement(SideBarTemplatesPage, {
                      onClick: self.togglePageButton, 
                      onDelete: self.deletePage, 
                      page: page, 
                      onPageUpdate: self.pageUpdateHandler})
                    )
                  );
              })
            ), 
            React.createElement("div", {id: "add-page"}, 
              React.createElement("form", {onSubmit: this.formSubmitHandler, 
                    onMouseOut: this.inputFocus, 
                    onMouseOver: this.inputBlur}, 
                React.createElement("input", {type: "text", 
                      className: "input", 
                      placeholder: "add new page", 
                      ref: "input", 
                      onFocus: this.inputFocus, 
                      onBlur: this.inputBlur}), 
                React.createElement("span", {className: "icon add icon-Add-Delete-Edit-Icons", 
                      onClick: this.addClickHandler, 
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

var SideBarElementsIcon = React.createClass({displayName: "SideBarElementsIcon",
  render: function(){
    return (
      React.createElement("div", {className: "element"}, 
        React.createElement("div", {className: this.props.typeName + " image icon-Element-Icons", "data-type": this.props.typeID}), 
        React.createElement("div", {className: "label"}, this.props.typeDisplay)
      )
    );
  }
})

var SideBarElements = React.createClass({displayName: "SideBarElements",
  componentDidMount: function(){
    var self = this;
    $('#elements .element .image').draggable({
      scroll: false,
      appendTo: 'body', /* Fix for dragging elements in scroll-y containers */
      containment: 'window', /* Same as above */
      connectToSortable: ".sort",
      /*
        Returns a clone with React properties to avoid react errors
      */
      helper: function(){
        var className = $(this).attr('class') + ' image-moving';
        return React.renderToString(React.createElement('div', {className: className}, null));
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
              React.createElement(SideBarElementsIcon, {typeID: "1", typeName: "title-icon", typeDisplay: "Title"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcon, {typeID: "2", typeName: "text-icon", typeDisplay: "Text"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcon, {typeID: "3", typeName: "img-icon", typeDisplay: "Image"})
            ), 
            React.createElement("li", {className: "sidebar-element"}, 
              React.createElement(SideBarElementsIcon, {typeID: "4", typeName: "nav-icon", typeDisplay: "Nav"})
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
  /*
    Toggle checkbox
  */
  clickHandler: function(){
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
                React.createElement("span", {className: checkboxState + " checkbox icon-Toggle-Switch", 
                      onClick: this.clickHandler})
              )
            )
          )
        )
      )
    );
  }
});

var SideBar = React.createClass({displayName: "SideBar",
  pageUpdateHandler: function(pages){
    this.props.onPageUpdate(pages);
  },
  /* 
    Mouse enter and leave are to control the 
    editor container overlay when window is small
  */
  mouseEnterHandler: function(){
    this.props.mouseEnter();
  },
  mouseLeaveHandler: function(){
    this.props.mouseLeave();
  },
  render: function(){
    return (
      React.createElement("div", {id: "sidebar", onMouseEnter: this.mouseEnterHandler, 
                        onMouseLeave: this.mouseLeaveHandler}, 
        React.createElement(SideBarTemplates, {onPageUpdate: this.pageUpdateHandler, 
                          pages: this.props.pages}), 
        React.createElement(SideBarElements, null), 
        React.createElement(SideBarSettings, null)
      )
    );
  }
});

/* 
  Elements structures below

  Mixin for all 4 types of elements
  This takes care of common events: delete hover and click
*/
var ElementEventsMixin = {
  deleteMouseOverHandler: function(e){
    $(e.currentTarget).siblings().hide();
    $(this.getDOMNode()).closest('.editor-element').addClass('delete');
  },
  deleteMouseOutHandler: function(e){
    $(e.currentTarget).siblings().show();
    $(this.getDOMNode()).closest('.editor-element').removeClass('delete');
  },
  deleteClickHandler: function(e){
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
          React.createElement("div", {className: "editor-element-handle left-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle right-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "delete icon-Delete-Element", 
                                  onMouseOver: this.deleteMouseOverHandler, 
                                  onMouseOut: this.deleteMouseOutHandler, 
                                  onClick: this.deleteClickHandler})
        ), 
        React.createElement("textarea", {type: "text", className: "input", 
                placeholder: "Add title here", 
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
          React.createElement("div", {className: "editor-element-handle left-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle right-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "delete icon-Delete-Element", 
                                  onMouseOver: this.deleteMouseOverHandler, 
                                  onMouseOut: this.deleteMouseOutHandler, 
                                  onClick: this.deleteClickHandler})
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
          React.createElement("div", {className: "editor-element-handle left-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle right-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "delete icon-Delete-Element", 
                                  onMouseOver: this.deleteMouseOverHandler, 
                                  onMouseOut: this.deleteMouseOutHandler, 
                                  onClick: this.deleteClickHandler})
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
          React.createElement("div", {className: "editor-element-handle left-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle right-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "editor-element-handle bottom-handle icon-Resize-Bar"}), 
          React.createElement("div", {className: "delete icon-Delete-Element", 
                                  onMouseOver: this.deleteMouseOverHandler, 
                                  onMouseOut: this.deleteMouseOutHandler, 
                                  onClick: this.deleteClickHandler})
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
    /*
      Note: To remove elements with 0 sizes sub arrays
      ** See Page structure for more information
    */
    nextState.elements = nextState.elements.filter(function(value, index, arr){ return value.length > 0; });
    return (nextState.hasOwnProperty('silent')) ? !nextState.silent : true;
  },
  componentDidMount: function(){
    this.enableSorting();
  },
  /* 
    After moving each elements inside the canvas 
    setState is called because of which componentDidUpdate 
    is called. At this stage inorder to enable nested 
    sorting enable sorting has to be enabled
  */
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
      distance: 0.001, /* Accuracy */
      scroll: true,
      connectWith: ".sort", /* Nested sorting */
      placeholder: {
        element: function(currentItem) {
          /* 
            For the dotted place holder
            Weird fix: Height is not used but just needs to be computed 
          */
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
        /* Case: Dragging elements to canvas */
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
          /* Case: Dragging elements within canvas */
          var targetPosition = ui.item.index();
          var targetParent = ui.item.closest('.horizontal').parent('li').index();
          var location = ui.item.data('location').split('-');
          var sourcePosition = location[1];
          var sourceParent = location[0];
          
          if(ui.item.closest('ul').hasClass('vertical')){
            elements.splice(targetPosition, 0, [elements[sourceParent].splice(sourcePosition, 1)[0]]);
          }else{
            elements[targetParent].splice(targetPosition, 0, elements[sourceParent].splice(sourcePosition, 1)[0]);
          }

          self.sort.sortable('cancel');
          ui.item.parents('.vertical').find('.ui-draggable').remove();
          
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
          React.createElement("ul", {className: "sort horizontal", 
              "data-id": "2", 
              "data-parent-id": index1, 
              "data-length": item.length}, 
            item.map(function(element, index2){
              var style = {
                width: Math.floor(99/item.length) + '%'
              };
              return (
                React.createElement(ListItem, {render: self.renderElement, 
                          style: style, 
                          index1: index1, 
                          index2: index2, 
                          element: element, 
                          key: element.id})
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
        this.props.render(this.props.element)
      )
    );
  }
});

var EditorPageNavigation = React.createClass({displayName: "EditorPageNavigation",
  getInitialState: function(){
    return {'pages': this.props.pages};
  },
  pageSelectHandler: function(page, index){
    if(!page.isSelected)
      this.props.onPageSelect(index);
  },
  render: function(){
    var self = this;
    var pages = this.props.pages || [];
    return (
      React.createElement("div", {id: "page-navigation"}, 
        React.createElement("ul", null, 
          pages.map(function(page, i){
            var pageName = page.pageName.length > 12 
                          ? page.pageName.substring(0,9) + '...' 
                          : page.pageName;
            return (
              React.createElement("li", {className: "page-container", 
                  onClick: self.pageSelectHandler.bind(this, page, i), 
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
  pageSelectHandler: function(pageIndex){
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
  pageUpdateHandler: function(elements){
    this.props.pages[this.currentPageIndex].pageContent.elements = elements;
  },
  render: function(){
    return (
      React.createElement("div", {id: "editor"}, 
        React.createElement(EditorPageNavigation, {ref: "editorPageNavigation", 
                              pages: this.state.pages, 
                              onPageSelect: this.pageSelectHandler}), 
        React.createElement(EditorContent, {ref: "editorContent", 
                        elements: this.state.pages[this.currentPageIndex].pageContent, 
                        onUpdate: this.pageUpdateHandler})
      )
    );
  }
});

var Application = React.createClass({displayName: "Application",
  componentDidMount: function() {
    this.editorNode = $(this.refs.editor.getDOMNode());
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },
  pageUpdateHandler: function(pages){
    var self = this;
    this.refs.editor.setState({
      'silent': true,
      'pages': pages
    }, function(){
      self.refs.editor.updatePageNavigation();
    });
  },
  editorContentOverlayShow: function(){
    if(window.innerWidth < 850)
      this.editorNode.removeClass('editor-content-overlap');
  },
  editorContentOverlayHide: function(){
    if(window.innerWidth < 850)
      this.editorNode.addClass('editor-content-overlap');
  },
  handleResize: function(e) {
    if(window.innerWidth < 850){
      this.editorNode.addClass('editor-content-overlap');
    }else{
      this.editorNode.removeClass('editor-content-overlap');
    }
  },
  render: function(){
    return (
      React.createElement("div", null, 
        React.createElement(Header, null), 
        React.createElement(SideBar, {
          onPageUpdate: this.pageUpdateHandler, 
          pages: this.props.pages, 
          mouseEnter: this.editorContentOverlayShow, 
          mouseLeave: this.editorContentOverlayHide}), 
        React.createElement(Editor, {
          ref: "editor", 
          pages: this.props.pages})
      )
    );
  }
});

/* NOTE: This will ideally be retrieved from DB */
var defaultPages = [{
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
  
React.render(React.createElement(Application, {pages: defaultPages}), document.getElementById("main"));

/* 
  Util function.
  Todo: Should be placed in Util class for code organising
*/
function GUID(){
  return Math.random().toString(36).substring(7);
}