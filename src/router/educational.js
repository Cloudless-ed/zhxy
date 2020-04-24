import Classroom from '../views/educational/Classroom'
import Classtime from '../views/educational/Classtime'
import Course from '../views/educational/Course'
import Evaluate from '../views/educational/Evaluate'
import Exam from '../views/educational/Exam'
import Lecturer from '../views/educational/Lecturer'
import Schedule from '../views/educational/Schedule'
import Selection from '../views/educational/Selection'
import Assignment from '../views/teaching/Assignment'
import Courseware from '../views/teaching/Courseware'
import Paper from '../views/teaching/Paper'
import Paperlist from '../views/teaching/Paperlist'
import Preparation from '../views/teaching/Preparation'
import Sign from '../views/teaching/Sign'
import Career from '../views/member/Career'
import Wechat from '../views/member/Wechat'


export  default  [{
        path: '/classroom',
        name: 'classroom',
        component: Classroom
    },
    {
        path: '/classtime',
        name: 'classtime',
        component: Classtime
    },
    {
        path: '/selection',
        name: 'selection',
        component: Selection
    },
    {
        path: '/course',
        name: 'course',
        component: Course
    },
    {
        path: '/courseware',
        name: 'courseware',
        component: Courseware
    },
    {
        path: '/preparation',
        name: 'preparation',
        component: Preparation
    },
    {
        path: '/sign',
        name: 'sign',
        component: Sign
    },
    {
        path: '/lecturer',
        name: 'lecturer',
        component: Lecturer
    },
    {
        path: '/evaluate',
        name: 'evaluate',
        component: Evaluate
    },
    {
        path: '/exam',
        name: 'exam',
        component: Exam
    },
    {
        path: '/schedule',
        name: 'schedule',
        component: Schedule
    },
    {
        path: '/assignment',
        name: 'assignment',
        component: Assignment
    },
    {
        path: '/paper',
        name: 'paper',
        component: Paper
    },
    {
        path: '/paperlist',
        name: 'paperlist',
        component: Paperlist
    },
    {
        path: '/wechat',
        name: 'wechat',
        component: Wechat
    },
    {
        path: '/career',
        name: 'career',
        component: Career
    }
]