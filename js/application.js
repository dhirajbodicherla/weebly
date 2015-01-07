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
	render: function(){
		return (
			<div className="element">
			  <div className={this.props.typeName + " image"} data-type={this.props.typeID}></div>
			  <div className="label">Title</div>
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
						<li><SideBarElementsIcons typeID="3" typeName="image-icon" typeDisplay="Image" /></li>
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
	render: function(){
		return (
			<div className="editor">
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
			  	      <ul>
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