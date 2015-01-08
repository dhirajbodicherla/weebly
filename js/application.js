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
	deletePage: function(){
		this.props.onDelete(this);
	},
	render: function(){
		return (
			<div className="page selected"><span className="name">{this.props.pageName}</span>
			  <span className="icon delete" onClick={this.deletePage}></span>
			  <span className="icon edit"></span>
			</div>
		);
	}
})

var SideBarTemplates = React.createClass({
	getInitialState: function(){
		return {pages: [{name: 'Home', id: GUID()}]};
	},
	formSubmit: function(e){
		e.preventDefault();
		this.addPage();
	},
	deletePage: function(child){
		var pages = this.state.pages;
		var position = pages.indexOf(pages.filter(function(v,i){ return v.id === child.props.pageID })[0]);
		this.state.pages.splice(position, 1);
		this.forceUpdate();
	},
	addPage: function(){

		var pageName = this.refs.input.getDOMNode().value;
		if(!pageName) return;

		this.state.pages.push({name: pageName, id: GUID()});
		this.refs.input.getDOMNode().value = '';
		this.forceUpdate();
		
		// <li></li>
		// <SideBarTemplatesPages pageName="Page" pageID="1"/>

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
							{this.state.pages.map(function(page){
								return <li><SideBarTemplatesPages onDelete={self.deletePage} pageName={page.name} pageID={page.id} p={page}/></li>
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
	componentDidMount: function(){
		$(this.refs.d.getDOMNode()).draggable({
		  connectToSortable: ".editor ul",
		  helper: "clone",
		  revert: "invalid",
		  revertDuration: 200,
		  start: function(){
		    // $('.editor .content').toggleClass('editing');
		  },
		  stop: function(event, ui){
		    // console.log('stopped dragging');
		    $(ui.helper).hide();
		    // $('.editor .content').toggleClass('editing');
		  }
		});
	},
	render: function(){
		return (
			<div className="element">
			  <div className={this.props.typeName + " image"} ref="d" data-type={this.props.typeID}></div>
			  <div className="label">{this.props.typeDisplay}</div>
			</div>
		);
	}
})

var SideBarElements = React.createClass({
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
	render: function(){
		return (
			<div className="sidebar">
				<div className="bg"></div>
				<SideBarTemplates />
				<SideBarElements />
				<SideBarSettings />
			</div>
		);
	}
});

var Editor = React.createClass({

	handleDrop: function(type, container, ui){
	    var ed = $('<div class="'+type+' editor-element"></div>');
	    var ctrl = $('<div class="controls"><div class="left-handle"></div><div class="right-handle"></div><div class="bottom-handle"></div><div class="delete"></div></div>');
	    ed.append(ctrl);
	    if(type === 1){
	      var p = $('<p class="placeholder">Start typing here</p>');
	      ed.addClass('editor-element-title');
	      ed.append(p);  
	    }else if(type === 2){
	      var p = $('<p class="placeholder">Start typing here</p>');
	      ed.addClass('editor-element-text');
	      ed.append(p);
	    }else if(type === 3){
	      var img = $('<div class="image"></div>');
	      var lab = $('<div class="label">add image +</div>');
	      var p = $('<div class="image-element"></div>');
	      p.append(img).append(lab);
	      ed.addClass('editor-element-image');
	      ed.append(p);
	    }else{
	      var nav = $('<p>Nav</p>');
	      ed.addClass('editor-element-nav');
	      ed.append(nav);
	    }
	    return ed;
	},
	componentDidMount: function(){
		var self = this;

		$(this.refs.e.getDOMNode()).on('mouseenter', '.delete', function(e){
		  $(this).siblings().hide();
		  $(this).parents('.editor-element').addClass('delete');
		}).on('mouseleave', '.delete', function(e){
		  $(this).siblings().show();
		  $(this).parents('.editor-element').removeClass('delete');
		}).on('click', '.delete', function(e){
		  $(this).parents('.editor-element').remove();
		});

		$(this.refs.g.getDOMNode()).sortable({
		  revert: 50,
		  placeholder: "portlet-placeholder ui-corner-all",
		  update: function(event, ui){
		    // console.log('update');
		  },
		  over: function(event, ui){
		    $('.editor .content').addClass('editing');
		    // console.log(ui.sender);
		    // console.log(ui.placeholder);
		  },
		  out: function(){
		    $('.editor .content').removeClass('editing');
		  },
		  receive: function (event, ui) {
		    
		    // handleDrop($(ui.draggable).data('type'), $(this), ui);
		      // $(this).append($(ui.helper).clone());
		      // $('.temp').remove();
		      // return false;
		  },
		  stop: function(event, ui){
		    if ($(ui.item).hasClass('ui-draggable')) {
		      var li = $('<li></li>');
		      li.append(self.handleDrop($(ui.item).data('type'), $(this), ui));
		      $(ui.item).replaceWith(li);
		    }
		    // console.log('stop');
		    // return false;
		  },
		  start: function(event, ui){
		    // console.log('start');
		  }
		  // containment: 'parent',
		  // tolerance: 'pointer',
		  // helper: 'clone'
		});
	},
	render: function(){
		return (
			<div className="editor" ref="e">
			  <div className="navigation">
			  	<ul>
			  	  <li>
			  	    <div className="page">
			  	      <span className="name">Page</span>
			  	    </div>
			  	  </li>
			  	</ul>
			  </div>
			  <div className="content">
			  	<table>
			  	  <tr>
			  	    <td>
			  	      <ul ref="g">
			  	      	<li>
			  	      		<div className="text">
                  		Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                		</div>
			  	      	</li>
			  	      </ul>
			  	    </td>
			  	  </tr>
			  	</table>
			  </div>
			</div>
		);
	}
});

var Application = React.createClass({
	render: function(){
		return (
			<div>
				<Navigation />
				<SideBar />
				<Editor />
			</div>
		);
	}
});

React.render(<Application />, document.body);

function GUID(){
	return Math.random().toString(36).substring(7);
}