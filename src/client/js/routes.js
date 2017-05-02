'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('studentlist', {
                url: '/studentlist',
                templateUrl: 'templates/student_list.html'
            })
            .state('class', {
                url: '/class',
                templateUrl: 'templates/class.html'
            })
            .state('report', {
                url: '/report',
                templateUrl: 'templates/report.html'
            })
            .state('rule', {
                url: '/rule',
                templateUrl: 'templates/rule.html'
            })
            .state('schoolyear', {
                url: '/schoolyear',
                templateUrl: 'templates/school_year.html'
            });
    }
]);