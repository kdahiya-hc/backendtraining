const posts = [
	{id: 1, title: 'Post One'},
	{id: 2, title: 'Post Two'},
];

const getPosts1 = function(){
	return posts;
};

export function getPosts2(){
	return posts;
};

export const getPosts3 = () => {
	return posts;
};

// export {getPosts1, getPosts2, getPosts3};
export const getPostsLength = () => posts.length;
export default getPosts1;
