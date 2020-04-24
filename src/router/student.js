import Award from '../views/student/Award'
import Class from '../views/student/Class'
import Classmate from '../views/student/Classmate'
import Discipclass from '../views/student/Discipclass'
import Disciproom from '../views/student/Disciproom'
import Duty from '../views/student/Duty'
import Enrollment from '../views/student/Enrollment'
import Homework from '../views/student/Homework'
import Honor from '../views/student/Honor'
import Leader from '../views/student/Leader'
import Parent from '../views/student/Parent'
import Room from '../views/student/Room'
import Roommate from '../views/student/Roommate'
import Student from '../views/student/Student'
import Wechats from '../views/student/Wechats'
export default [
          {
            path: '/award',
            name: 'award',
            component: Award
          },
          {
            path: '/class',
            name: 'class',
            component: Class
          },
          {
            path: '/classmate',
            name: 'classmate',
            component: Classmate
          },
          {
            path: '/discipclass',
            name: 'discipclass',
             component: Discipclass
          },
          {
            path: '/disciproom',
            name: 'disciproom',
            component: Disciproom
          },
          {
            path: '/duty',
            name: 'duty',
            component: Duty
          },
          {
            path: '/enrollment',
            name: 'enrollment',
            component: Enrollment
          },
          {
            path: '/homework',
            name: 'homework',
            component: Homework
          },
          {
            path: '/honor',
            name: 'honor',
            component: Honor
          },
          {
            path: '/leader',
            name: 'leader',
            component: Leader
          },
          {
            path: '/parent',
             name: 'parent',
              component: Parent
          },
          {
            path: '/room',
            name: 'room',
            component: Room
          },
          {
            path: '/roommate',
            name: 'roommate',
            component: Roommate
          },
          {
            path: '/student',
             name: 'student',
             component: Student
          },
          {
            path: '/wechats',
            name: 'wechats',
            component: Wechats
          }
]