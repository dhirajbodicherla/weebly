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
	render: function(){
		return (
			<div className="page selected"><span className="name">Page</span>
			  <span className="icon delete"></span>
			  <span className="icon edit"></span>
			</div>
		);
	}
})

var SideBarTemplates = React.createClass({
	render: function(){
		return (
			<div className="templates item">
				<div className="divider">
				  Templates
				</div>
				<div className="content">
					<div className="pages">
						<ul>
							<li><SideBarTemplatesPages /></li>
						</ul>
						<div className="add-page">
						  <input type="text" className="input" placeholder="add new page" />
						  <span className="icon add"></span>
						</div>
					</div>
				</div>
			</div>
		);
	}
});

var SideBarElementsIcons = React.createClass({
	componentDidMount: function(){
		console.log(this.refs.d);
		$(this.refs.d.getDOMNode()).draggable({
		  connectToSortable: ".editor ul",
		  helper: "clone",
		  revert: "invalid",
		  revertDuration: 200,
		  start: function(){
		    // $('.editor .content').toggleClass('editing');
		  },
		  stop: function(event, ui){
		    console.log('stopped dragging');
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
	componentDidMount: function(){
		$(this.refs.e.getDOMNode()).sortable({
		  revert: 50,
		  placeholder: "portlet-placeholder ui-corner-all",
		  update: function(event, ui){
		    console.log('update');
		  },
		  over: function(event, ui){
		    $('.editor .content').addClass('editing');
		    console.log(ui.sender);
		    console.log(ui.placeholder);
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
		      li.append(handleDrop($(ui.item).data('type'), $(this), ui));
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
			<div className="editor">
			  <div className="navigation">
			  	<ul ref="e">
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
			  	      <ul ref="e">
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
	// componentDidMount: function(){
	// 	console.log(SideBar);
	// },
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