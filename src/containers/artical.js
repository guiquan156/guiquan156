const { Link } = require('react-router');
const { connect } = require('react-redux');
const { getArtical, getSingleArticalActionAsync } = require('../actions/action.js');
const React = require('react');
const marked = require('marked');
const hljs = require('highlight.js');

class Artical extends React.Component {

	markBody(body){
		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: false,
			pedantic: false,
			sanitize: false,
			smartLists: true,
			smartypants: false,
			highlight: function (code) {
				return hljs.highlightAuto(code).value;
			}
		});
		return { __html: marked(body) };
	}

	render() {
		let { articals } = this.props;
		let id = this.props.params.id;
		let artical = null;
		let tmpl = '';

		for(let i=0, len=articals.length; i<len; i++ ){
			if(articals[i].number == id){
				artical = articals[i];
				break;
			}
		}
		if(artical){ //state中有artical
			let updateTime = artical.updated_at ? artical.updated_at : artical.created_at;
			let date = updateTime.split('T').shift();
			tmpl = (
				<div className="artical wrap">
					<p className="title">{artical.title}</p>
					<p className="date">{date}</p>
					<div dangerouslySetInnerHTML={this.markBody(artical.body)}></div>
				</div>
			);
		}else{
			tmpl = (<div className="artical wrap"></div>);
		}

		return tmpl;
	}

	componentWillMount(){
		let { dispatch, articals, blogInfo } = this.props;
		let id = this.props.params.id;
		let shouldFetch = true;

		if(blogInfo.length == 0) dispatch(getSingleArticalActionAsync(id));//直接访问artical页面时候

		for(let i=0, len=articals.length; i<len; i++){
			if(articals[i].id == id){
				shouldFetch = false;
				break;
			}
		}

		if(shouldFetch){
			for(let i = 0, len = blogInfo.length; i < len; i++){
				if (blogInfo[i].number == id) {
					dispatch(getArtical(blogInfo[i]));//不存在向服务器请求数据 更新state 然后render
				}
			}
		}
	}
}

module.exports = connect(state => {
	return {
		articals: state.articals,
		blogInfo: state.blogInfo
	}
})(Artical);