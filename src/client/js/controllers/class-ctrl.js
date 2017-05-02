/**
 * Student List Controller
 */

angular.module('RDash')
    .controller('ClassCtrl', ['$scope', ClassCtrl]);

function ClassCtrl($scope) {
    console.log("TESTING!!!Phong Nguyen Class");
    $scope.studentList = {
        data: [
            {
                id: "170001",
                firstname: "Nguyễn Thành",
                lastname: "Phong",
                gender: "Nam",
                birthday: "1994",
                class: "12B3",
                email: "phong@gmail.com",
                address: "Vietnam"
            },{
                id: "170002",
                firstname: "Nguyễn Quốc",
                lastname: "Thái",
                gender: "Nam",
                birthday: "1994",
                class: "12B2",
                email: "thai@gmail.com",
                address: "Hồ Chí Minh"
            },{
                id: "170003",
                firstname: "Huỳnh Duy",
                lastname: "Thức",
                gender: "Nam",
                birthday: "1993",
                class: "12B1",
                email: "thuc@gmail.com",
                address: "Hà Nội"
            },{
                id: "170004",
                firstname: "Nguyễn Văn",
                lastname: "A",
                gender: "Nam",
                birthday: "1999",
                class: "10B3",
                email: "aa@gmail.com",
                address: "Long An"
            },{
                id: "170005",
                firstname: "Nguyễn Thị",
                lastname: "B",
                gender: "Nữ",
                birthday: "1998",
                class: "10B1",
                email: "bb@gmail.com",
                address: "Lào"
            },
        ],
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 70 },
            { field: 'id', displayName: 'Mã học sinh' },
            { field: 'firstname', displayName: 'Họ' },
            { field: 'lastname', displayName: 'Tên' },
            { field: 'gender', displayName: 'Giới' },
            { field: 'birthday', displayName: 'Ngày Sinh' },
            { field: 'class', displayName: 'Lớp' },
            { field: 'email', displayName: 'Email' },
            { field: 'address', displayName: 'Địa chỉ' }
        ]
    };
}