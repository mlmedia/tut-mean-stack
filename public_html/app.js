(function() {
    /* set up the module */
    var app = angular.module('flapperNews', ['ui.router']);

    /* config */
    app.config([
        '$stateProvider',
        '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {
            /* resolve ensures that any time home is entered, we always load all posts before state finishes loading */
            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: '/home.html',
                    controller: 'MainCtrl',
                    resolve: {
                        postPromise: ['posts', function(posts) {
                            return posts.getAll();
                        }]
                    }
                })
                .state('posts', {
                    url: '/posts/:id',
                    templateUrl: '/posts.html',
                    controller: 'PostsCtrl',
                    resolve: {
                        post: ['$stateParams', 'posts', function($stateParams, posts) {
                            return posts.get($stateParams.id);
                        }]
                    }
                });
            $urlRouterProvider.otherwise('home');
        }
    ]); /* /end config */

    /* set up the main controller */
    app.controller('MainCtrl', [
        '$scope',
        'posts',
        function($scope, posts) {
            $scope.posts = posts.posts;

            /* set title to blank to prevent empty posts */
            $scope.title = '';
            $scope.addPost = function() {
                if ($scope.title.length === 0) {
                    alert('Title is required');
                    return;
                }
                /* check for valid URL */
                var isValidUrl = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.‌​\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[‌​6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1‌​,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00‌​a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u‌​00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;
                var url = $scope.link;
                if ($scope.link && !isValidUrl.test(url)) {
                    alert('You must include a valid url (ex: http://www.example.com');
                    return;
                }

                /* create a new post */
                posts.create({
                    title: $scope.title,
                    link: $scope.link
                });

                /* clear the values after post to clear the form */
                $scope.title = '';
                $scope.link = '';
            };

            /* upvote function */
            $scope.upvote = function(post) {
                posts.upvote(post);
            };

            /* downvote function */
            $scope.downvote = function(post) {
                posts.downvote(post);
            };
        }
    ]); /* /end MainCtrl */

    /* posts controller */
    app.controller('PostsCtrl', [
        '$scope',
        'posts',
        'post',
        function($scope, posts, post) {
            $scope.post = post;

            /* add comment to post */
            $scope.addComment = function() {
                /* if comment body is empty, return without saving */
                if ($scope.body === '') {
                    return;
                }

                /* call the addComment function from the model */
                posts.addComment(post._id, {
                    body: $scope.body,
                    author: 'user'
                }).success(function(comment) {
                    $scope.post.comments.push(comment);
                });

                /* clear the form field */
                $scope.body = '';
            };

            /* upvote a comment */
            $scope.upvote = function(comment) {
                posts.upvoteComment(post, comment);
            };

            /* downvote a comment */
            $scope.downvote = function(comment) {
                posts.downvoteComment(post, comment);
            };
        }
    ]);

    /* service for auth */
    app.factory('auth', [
        '$http',
        '$window',
        function($http, $window) {
            var auth = {};

            /* save the json web token */
            auth.saveToken = function(token) {
                $window.localStorage['flapper-news-token'] = token;
            };

            /* get the token */
            auth.getToken = function() {
                return $window.localStorage['flapper-news-token'];
            }

            /* check if logged in */
            auth.isLoggedIn = function() {
                var token = auth.getToken();

                if (token) {
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.exp > Date.now() / 1000;
                } else {
                    return false;
                }
            };

            /* get the current user */
            auth.currentUser = function() {
                if (auth.isLoggedIn()) {
                    var token = auth.getToken();
                    var payload = JSON.parse($window.atob(token.split('.')[1]));

                    return payload.username;
                }
            };

            /* create the new user on registration */
            auth.register = function(user) {
                return $http.post('/register', user).success(function(data) {
                    auth.saveToken(data.token);
                });
            };

            /* log in */
            auth.logIn = function(user) {
                return $http.post('/login', user).success(function(data) {
                    auth.saveToken(data.token);
                });
            };

            /* log out */
            auth.logOut = function() {
                $window.localStorage.removeItem('flapper-news-token');
            };

            return auth;
        }
    ]);

    /* service for posts */
    app.factory('posts', [
        '$http',
        function($http) {
            /* set up the posts object */
            var o = {
                posts: []
            };

            /* get list of posts and copy to posts object using angular.copy() - see index.ejs */
            o.getAll = function() {
                return $http.get('/posts').success(function(data) {
                    angular.copy(data, o.posts);
                });
            };

            /**
             * uses router.post in index.js to post a new Post model to mongoDB
             * when $http gets success, it adds this post to the posts object in local factory
             */
            o.create = function(post) {
                return $http.post('/posts', post).success(function(data) {
                    o.posts.push(data);
                });
            };

            /* use express route for this post's id to add upvote to mongo model */
            o.upvote = function(post) {
                return $http.put('/posts/' + post._id + '/upvote').success(function(data) {
                    post.votes += 1;
                });
            };

            /* downvote a post */
            o.downvote = function(post) {
                return $http.put('/posts/' + post._id + '/downvote').success(function(data) {
                    post.votes -= 1;
                });
            };

            /* grab a single post from server */
            o.get = function(id) {
                return $http.get('/posts/' + id).then(function(res) {
                    return res.data;
                });
            };

            /* add a comment */
            o.addComment = function(id, comment) {
                return $http.post('/posts/' + id + '/comments', comment);
            };

            /* upvote a comment */
            o.upvoteComment = function(post, comment) {
                return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote').success(function(data) {
                    comment.votes += 1;
                });
            };

            /* downvote a comment */
            o.downvoteComment = function(post, comment) {
                return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote').success(function(data) {
                    comment.votes -= 1;
                });
            };

            /* return the object after defining all functions */
            return o;
        }
    ]);
})();
