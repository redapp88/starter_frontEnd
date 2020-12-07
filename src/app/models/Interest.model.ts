import {User} from './User.model';
import {Project} from './Project.model';

export class Interest{
constructor(    public id,
                public user:User,
                public project:Project,
                public message:String,
                public creationDate:Date,
                public state:string,
                public direction:String){


}
}