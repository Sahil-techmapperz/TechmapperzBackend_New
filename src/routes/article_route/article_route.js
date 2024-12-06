const express = require("express");
const article_route = express.Router();
const cors = require("cors");
article_route.use(cors());
const fetch = require('node-fetch');
const axios = require('axios');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');



const users = [
  {
    id: 1,
    username: 'Sakil90',
    password: 'BjyaDf53%0Y0J!eQM3jbZFWo',
  },
];

passport.use(
  new LocalStrategy(function (username, password, done) {
    const user = users.find((user) => user.username === username);

    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = users.find((user) => user.id === id);
  done(null, user);
});




article_route.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);

article_route.use(passport.initialize());
article_route.use(passport.session());




function checkAuth(req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ error: 'Sorry, you must be logged in to comment.' });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return next();
    });
  })(req, res, next);
}



article_route.get("/", async (req, res) => {
  const fetchPosts = async () => {
    try {
      let response = await fetch('https://www.test.geotechcybernauts.com/wp-json/wp/v2/posts');
      response=await response.json();
      const postsWithImgurl = await Promise.all(
        response.map(async post => {
          let ImgResponse = await fetch(`https://www.test.geotechcybernauts.com/wp-json/wp/v2/media/${post.featured_media}`);
          ImgResponse= await ImgResponse.json();
          return {...post,img_url: ImgResponse.guid};
        })
      );
      
      return postsWithImgurl;
    } catch (error) {
      console.error(error);
    }
  };


let post=await fetchPosts();


  res.status(200).send(post);
});


article_route.get("/test",async(req,res)=>{


let fetchPosts=async()=>{

  let response1 = await fetch('https://www.test.geotechcybernauts.com/wp-json/wp/v2/posts');
response1 = await response1.json();

const authorId = response1[0].author; // Get the author ID from the first post in the response

let response2 = await fetch(`https://www.test.geotechcybernauts.com/wp-json/wp/v2/users/${authorId}`);
response2 = await response2.json();

let response3 = await fetch(`https://www.test.geotechcybernauts.com/wp-json/wp/v2/media/${response1[0].featured_media}`);
response3 = await response3.json();

const postsWithAuthor = await Promise.all(
  response1.map(async post => {
    return {...post, author: response2.name, img_url: response3.guid};
  })
);

return postsWithAuthor;



}



let post = await fetchPosts();


res.status(200).send(post)

})



article_route.post("/singale_artical",async (req, res) => {
  
const {id}=req.body;

const fetchPosts = async () => {
  try {
    let response = await fetch(`https://www.test.geotechcybernauts.com/wp-json/wp/v2/posts/${id}`);
    response=await response.json();
    
    
    return response;
  } catch (error) {
    console.error(error);
  }
};


let post=await fetchPosts();


res.status(200).send(post);

});











const baseUrl = 'http://blogs.techmapperz.com/wp-json/wp/v2';



const perPage = 5;

// Function to fetch total post count
async function fetchTotalPostCount() {
  const response = await axios.get(`${baseUrl}/posts`);
  const totalPostCount = parseInt(response.headers['x-wp-total']);
  return totalPostCount;
}

// Function to fetch all authors
async function fetchAuthors() {
  try {
    const response = await axios.get(`${baseUrl}/users`);
    return response.data.reduce((authors, author) => {
      authors[author.id] = author;
      return authors;
    }, {});
  } catch (error) {
    console.error('Error fetching authors:', error);
    return {};
  }
}







// Function to fetch posts with pagination
async function fetchPosts(page = 1,perPage=5) {
  const response = await axios.get(`${baseUrl}/posts?_embed&page=${page}&per_page=${perPage}`);
  return response.data;
}





// Function to extract relevant information from each post

function extractPostData(posts, authors) {
  return posts.map(post => {
    const featuredMedia = post._embedded['wp:featuredmedia'];
    const imgUrl = featuredMedia && featuredMedia[0]?.media_details?.sizes?.full?.source_url;
    const author = authors[post.author];

    return {
      id: post.id,
      title: post.title.rendered,
      description: post.excerpt.rendered,
      content: post.content.rendered,
      imgUrl: imgUrl || null,
      date:post.date,
      author: {
        id: author.id,
        name: author.name,
        link: author.link,
      },
    };
  });
}


// Get All posts

article_route.get('/posts', async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const Perpage = req.query.perpage ? parseInt(req.query.perpage) : 5;
    const authors = await fetchAuthors();
    const totalPostCount = await fetchTotalPostCount();
    const totalPages = Math.ceil(totalPostCount / Perpage);
    const posts = await fetchPosts(page,Perpage);
    const postData = extractPostData(posts, authors);
    res.json({
      page,
      Perpage,
      totalPostCount,
      totalPages,
      posts: postData,
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});



// Get Single post

article_route.get('/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const postResponse = await axios.get(`${baseUrl}/posts/${postId}?_embed`);
    const post = postResponse.data;
    const authors = await fetchAuthors();
    const postData = extractPostData([post], authors)[0];
    // res.json(postData);
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});





// Get recent posts
article_route.get('/recent-posts', async (req, res) => {
  try {
    const response = await axios.get(`${baseUrl}/posts?_embed&per_page=5`);
    const posts = response.data;
    const authors = await fetchAuthors();
    const postData = extractPostData(posts, authors);
    res.json(postData);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    res.status(500).json({ error: 'Failed to fetch recent posts' });
  }
});

// Get related posts
article_route.get('/related-posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const postResponse = await axios.get(`${baseUrl}/posts/${postId}`);
    const post = postResponse.data;
    const categoryId = post.categories[0]; // Assuming the first category is the main one

    const relatedPostsResponse = await axios.get(
      `${baseUrl}/posts?_embed&per_page=5&exclude=${postId}&categories=${categoryId}`
    );
    const relatedPosts = relatedPostsResponse.data;
    const authors = await fetchAuthors();
    const postData = extractPostData(relatedPosts, authors);
    res.json(postData);
  } catch (error) {
    console.error('Error fetching related posts:', error);
    res.status(500).json({ error: 'Failed to fetch related posts' });
  }
});

// Submit a comment
article_route.post('/submit-comment',checkAuth, async (req, res) => {
  try {
    const { postId, authorName, authorEmail, content } = req.body;

    const response = await axios.post(`${baseUrl}/comments`, {
      post: postId,
      author_name: authorName,
      author_email: authorEmail,
      content: content,
    });

    console.log(response);

    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({ error: 'Failed to submit comment' });
  }
});



// Search Route

article_route.get("/search",async(req,res)=>{
  const search = req.query.search || '';

  try{
  const response = await axios.get(`${baseUrl}/posts?_embed&&search=${search}`);
    
  const postData = response.data.map((post) => {
    const author = post._embedded.author[0];
    const excerpt = post.excerpt.rendered;
    
    return {
      id: post.id,
      title: post.title.rendered,
      content: post.content.rendered,
      description: excerpt,
      author: {
        id: author.id,
        name: author.name,
        link: author.link,
      },
    }
  });
  res.send(postData[0]);
}catch(error){
  res.status(500).json({ error });
}
    
})


module.exports = article_route;
