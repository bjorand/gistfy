$(document).ready(function () {
    var hash = location.hash;
    if (hash) {
        $('#tabMenu a[href="' + hash + '"]').tab('show');
    }

    $('#tabMenu a').click(function () {
        location.hash = $(this).context.hash;
    });
});

angular.module('App', []).controller('MainController', ['$scope', '$sce', '$http', function ($scope, $sce, $http) {

    $scope.types = [{ id: 'gist' , desc: 'Gist' }, { id: 'repo', desc: 'Repository' }];
    $scope.hosts = [{ id: 'github', desc: 'GitHub' }, { id: 'bitbucket', desc: 'Bitbucket' }];

    $scope.model = {
        type: null,
        id: null,
        host: null,
        user: null,
        repo: null,
        file: null
    };

    $scope.result = {
        url: null,
        show: false,
        html: null,
        hasError: false,
        errorMsg: null
    };

    $scope.changeType = function () {
        $scope.isGist = ($scope.model.type !== null) && ($scope.model.type.id === 'gist');
        $scope.isRepo = ($scope.model.type !== null) && ($scope.model.type.id === 'repo');
        $scope.result.show = false;
    };

    $scope.thisYear = function () {
        return (new Date()).getFullYear();
    };

    $scope.btnOkClick = function () {
        if (!$scope.formTry.$valid) {
            return;
        }

        var url;

        if ($scope.isGist) {
            url = '/github/gist/' + $scope.model.id;
        } else if ($scope.isRepo) {
            url = '/' + $scope.model.host.id + '/' + $scope.model.user + '/' + $scope.model.repo + '/' + $scope.model.file;
        }

        $http({ method: 'GET', url: url + '?type=html' })
            .success(function (data, status, headers, config) {
                $scope.result.url = /*'http://www.gistfy.com'*/location.origin + url;
                $scope.result.html = $sce.trustAsHtml(data);
                $scope.result.hasError = false;
                $scope.result.show = true;
            })
            .error(function (data, status, headers, config) {
                $scope.result.html = null;
                $scope.result.hasError = true;

                if (status === 400 || status === 412) {
                    $scope.result.errorMsg =  $sce.trustAsHtml(data);
                } else if (status === 404) {
                    $scope.result.errorMsg = ($scope.isGist ? 'Gist not found.' : 'File not found.');
                } else {
                    $scope.result.errorMsg = 'Oh snap! There\'s an error.';
                }

                $scope.result.show = true;
            });
    };

    $scope.changeType();
}]);