
import Dept from '../views/authority/Dept'
import Func from '../views/authority/Func'
import Log from '../views/authority/Log'
import Logbook from '../views/authority/Logbook'
import Member from '../views/authority/Member'
import Party from '../views/authority/Party'
import Permrole from '../views/authority/Permrole'
import Permuser from '../views/authority/Permuser'
import Role from '../views/authority/Role'
import Roleuser from '../views/authority/Roleuser'
import Unit from '../views/authority/Unit'
import User from '../views/authority/User'
export default [
    {
        path: '/dept',
        component: Dept,
    },
    {
        path: '/func',
        component: Func,
    },
    {
        path: '/log',
        component: Log,
    },
    {
        path: '/logbook',
        component: Logbook,
    },
    {
        path: '/member',
        component: Member,
    },
    {
        path: '/party',
        component: Party,
    },
    {
        path: '/permrole',
        component: Permrole,
    },
    {
        path: '/permuser',
        component: Permuser,
    },
    {
        path: '/role',
        component: Role,
    },
    {
        path: '/roleuser',
        component: Roleuser,
    },
    {
        path: '/unit',
        component: Unit,
    },
    {
        path: '/user',
        component: User,
    },
]
