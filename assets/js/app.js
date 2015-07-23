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
            controller: 'MainCtrl'
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
    function()
    {
        /* create and return the posts var */
        var o = {
            posts: []
        };
        return o;
    }
])

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
            if ( !$scope.title || $scope.title == '' )
            {
                return;
            }

            /* add the post variables */
            $scope.posts.push({
                title: $scope.title,
                link: $scope.link,
                upvotes: 0,
                comments: [
                    {author: 'Joe', body: 'Cool post!', upvotes: 0},
                    {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
                ]
            });

            /* we set the variables as empty after we add the new post to clear the form */
            $scope.title = '';
            $scope.link = '';
        }

        /* add post function */
        $scope.incrementUpvotes = function(post)
        {
            post.upvotes += 1;
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
    }
]);
