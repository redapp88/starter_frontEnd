import {Profile} from './Profile.model';
import {Interest} from './Interest.model';

export class User {
    constructor(public username: string,
                public name: string,
                public mail: string,
                public description: string,
                public phone: string,
                public city: string,
                public subsDate: Date,
                public state: string,
                public profiles:Profile[],
                public interests:Interest[]
)
    {}

}