import Answer from '../views/library/Answer'
import Cartoon from '../views/library/Cartoon'
import Exercise from '../views/library/Exercise'
import Material from '../views/library/Material'
import Microlesson from '../views/library/Microlesson'
import Question from '../views/library/Question'
import Video from '../views/library/Video'
import CartoonFile from '../views/library/CartoonFile'
import MaterialFile from '../views/library/MaterialFile'
import VideoFile from '../views/library/VideoFile'
import MicrolessonFile from '../views/library/MicrolessonFile'
import ExerciseFile from '../views/library/ExerciseFile'
import AnswerFile from '../views/library/AnswerFile'
import QuestionFile from '../views/library/QuestionFile'


export default [{
        path: '/answer',
        component: Answer
    },
    {
        path: '/cartoon',
        component: Cartoon
    },
    {
        path: '/exercise',
        component: Exercise
    },
    {
        path: '/material',
        component: Material
    },
    {
        path: '/microlesson',
        component: Microlesson
    },
    {
        path: '/question',
        component: Question
    },
    {
        path: '/video',
        component: Video
    },
    {
        path: '/cartoonFile',
        component: CartoonFile
    },
    {
        path: '/materialFile',
        component: MaterialFile
    },
    {
        path: '/videoFile',
        component: VideoFile
    },
    {
        path: '/microlessonFile',
        component: MicrolessonFile
    }, {
        path: '/exerciseFile',
        component: ExerciseFile
    }, {
        path: '/answerFile',
        component: AnswerFile
    }, {
        path: '/questionFile',
        component: QuestionFile
    }
]