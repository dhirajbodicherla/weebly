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
		}]
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
									<li>
										<SideBarTemplatesPages 
											key={i}
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
			  <div className={this.props.typeName + " image"} ref="d" data-type={this.props.typeID}></div>
			  <div className="label">{this.props.typeDisplay}</div>
			</div>
		);
	}
})

var SideBarElements = React.createClass({
	componentDidMount: function(){
		// $(this.getDOMNode()).find('li .image').draggable({
		$('.elements .element .image').draggable({
			connectToSortable: ".sort",
			helper: function(){
				return React.renderToString(React.createElement('div', {className: 'text-icon image ui-draggable ui-draggable-handle'}, null));
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

var EditorContent = React.createClass({
	getInitialState: function() {
		var elements = {};
		elements[GUID()] = [
			{
				type: '2',
				props: {
					content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
				}
			}
		];
	  return {
	  	elements: elements
	  };
	},
	renderElement: function(el){
		var elType = el.type;
		var content = el.props.content;
		if(elType == 1){
			return (
				<div className={elType +' editor-element editor-element-title'}>
					<div className="controls">
						<div className="left-handle"></div>
						<div className="right-handle"></div>
						<div className="bottom-handle"></div>
						<div className="delete"></div>
					</div>
					<p className="placeholder">
						{(content == '') ? "Start typing here" : content}
					</p>
				</div>
			);
		}else if(elType == 2){
			return (
				<div className={elType +' editor-element editor-element-text'}>
					<div className="controls">
						<div className="left-handle"></div>
						<div className="right-handle"></div>
						<div className="bottom-handle"></div>
						<div className="delete"></div>
					</div>
					<p className="placeholder">
					{(content == '') ? "Start typing here" : content}
					</p>
				</div>
			);
		}else if(elType == 3){
			return(
				<div className={elType +' editor-element editor-element-image'}>
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
		}else{
			return (
				<div className={elType +' editor-element editor-element-nav'}>
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
	},
	componentDidMount: function(){
		var self = this;
		var stateElements = this.state.elements;

		$('.sort').sortable({
		  revert: 50,
		  connectWith: '.sort',
		  dropOnEmpty: true,
		  // placeholder: "portlet-placeholder ui-corner-all",
		  over: function(event, ui){
		    // $('.editor .content').addClass('editing');
		  },
		  out: function(){
		    // $('.editor .content').removeClass('editing');
		  },
		  receive: function (event, ui) {
		  	
		  },
		  stop: function(event, ui){
		  	if(ui.item.hasClass('image')){
		  		ui.item.remove();
		  		var position = $('li.sort-item').index($(this));
		  		var category = ui.item.closest('ul').data('parent-id');
        	var elements = self.state.elements;
        	var guid = GUID();

					if(!category){
						category = guid;
						elements[guid] = [];
						position = 0;
					}

					elements[category][position] = {
						type: ui.item.data('type'),
						props: {
							content : ''
						}
					};

					self.setState({
						elements: elements
					})
				}
		  }
		});

	},
	render: function(){
		var self = this;
		
		var elements = $.map(this.state.elements,function(item, i){
			return (
				<ul className="sort" data-id="1">
					<li className="sort-item">
						<ul className="sort" data-id="2" data-parent-id={i}>
							{item.map(function(i){
									return (
										<li className="sort-item">
											{self.renderElement(i)}
										</li>
									);	
							})}
						</ul>
					</li>
				</ul>
			);
		});

		return (
			<div className="content">
	  		{elements}
	  	</div>
	  );
	}
})

var TitleElement = React.createClass({
	render: function(){
		return (
			<p className="placeholder">Start typing here</p>
		);
	}
});

var TextElement = React.createClass({
	render: function(){
		return (
			<p className="placeholder">Start typing here</p>
		);
	}
});

var ImageElement = React.createClass({
	render: function(){
		return (
			<div className="image-element">
				<div className="image"></div>
				<div className="label">add image +</div>
			</div>
		);
	}
});

var NavElement = React.createClass({
	render: function(){
		return (
			<p>Nav</p>
		);
	}
});

var Editor = React.createClass({
	
	updatePageNavigation: function(pages){
		this.refs.editorNavigation.updatePageNavigation(pages);
	},

	componentDidMount: function(){
		
		var self = this;
		// var stateElements = this.state.elements;

		$(this.refs.e.getDOMNode()).on('mouseenter', '.delete', function(e){
		  $(this).siblings().hide();
		  $(this).parents('.editor-element').addClass('delete');
		}).on('mouseleave', '.delete', function(e){
		  $(this).siblings().show();
		  $(this).parents('.editor-element').removeClass('delete');
		}).on('click', '.delete', function(e){
		  $(this).parents('.editor-element').remove();
		});
		
	},
	render: function(){
		return (
			<div className="editor" ref="e">
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