import {Interest} from './Interest.model';
import {Profile} from './Profile.model';
import {User} from './User.model';

export class Project{

constructor(public id:number,
            public title:string,
            public description:string,
            public contry:string,
            public city:string,
            public categorie:string,
            public creationDate:Date,
            public profiles:Profile[],
            public interests:Interest[],
            public owner:User,
            public state: string

            ){

}
}