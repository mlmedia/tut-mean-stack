/* set the app module */
var app = angular.module('flapperNews', ['ui.router']);

/* set up the config */
app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider)
    {
        /* set up the home route */
        $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/home.html',
            controller: 'MainCtrl',
            resolve: {
                postPromise: [
                    'posts',
                    function(posts)
                    {
                        return posts.getAll();
                    }
                ]
            }
        })
        .state('posts', {
            url: '/posts/{id}',
            templateUrl: '/posts.html',
            controller: 'PostsCtrl'
        });

        /* set the default if route not found */
        $urlRouterProvider.otherwise('home');
    }
]);

/* set up the posts factory */
app.factory('posts', [
    '$http',
    function($http)
    {
        /* create and return the posts var */
        var o = {
            posts: []
        };

        /* get the posts */
        o.getAll = function()
        {
            return $http.get('/posts').success(function(data){
                angular.copy(data, o.posts);
            });
        };

        /* create a new post */
        o.create = function(post)
        {
            return $http.post('/posts', post).success(function(data)
            {
                /* push to the posts object */
                o.posts.push(data);
            });
        };

        /* upvote a post */
        o.upvote = function(post)
        {
            return $http.put('/posts/' + post._id + '/upvote').success(function(data)
            {
                post.upvotes += 1;
            });
        };

        /* return the object (must stay on bottom) */
        return o;
    }
]);



/* setup the main controller */
app.controller('MainCtrl', [
    '$scope',
    'posts',
    function($scope, posts)
    {
        /* posts array object */
        $scope.posts = posts.posts;
        /*
        $scope.posts = [
            {title:'post 1', upvotes: 5},
            {title:'post 2', upvotes: 2},
            {title:'post 3', upvotes: 15},
            {title:'post 4', upvotes: 9},
            {title:'post 5', upvotes: 4}
        ];
        */

        /* add post function */
        $scope.addPost = function()
        {
            /* if title is empty, return without posting */
            if ( !$scope.title || $scope.title === '' )
            {
                return;
            }

            /* add the post variables */
            /*
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });
            */

            /* use the create method to save post to DB */
            posts.create({
                title: $scope.title,
                link: $scope.link,
            });

            /* we set the variables as empty after we add the new post to clear the form */
            $scope.title = '';
            $scope.link = '';
        }

        /* add post function */
        $scope.incrementUpvotes = function(post)
        {
            posts.upvote(post);
        }
    }
]);

/* setup the posts controller */
app.controller('PostsCtrl', [
    '$scope',
    '$stateParams',
    'posts',
    function($scope, $stateParams, posts)
    {
        $scope.post = posts.posts[$stateParams.id];

        /* add comment */
        $scope.addComment = function()
        {
            if($scope.body === '')
            {
                return;
            }
            $scope.post.comments.push({
                body: $scope.body,
                author: 'user',
                upvotes: 0
            });
            $scope.body = '';
        };
    }
]);
