/* set the app module */
var app = angular.module('flapperNews', []);

/* setup the main controller */
app.controller('MainCtrl', [
    '$scope',
    function($scope)
    {
        /* posts array object */
        $scope.posts = [
            {title:'post 1', upvotes: 5},
            {title:'post 2', upvotes: 2},
            {title:'post 3', upvotes: 15},
            {title:'post 4', upvotes: 9},
            {title:'post 5', upvotes: 4}
        ];

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
                upvotes: 0
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
