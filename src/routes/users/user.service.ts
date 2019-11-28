import { getRepository } from 'typeorm';
import User from './user.entity';
import { CreateUserDto, UpdateUserDto, FindUserDto } from './user.dto';



class UserService {
    private userRepository = getRepository(User)

    public addUser = async (userData: CreateUserDto) => {
        try {
                const user = await this.userRepository.save(userData);
                return (user);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Profile already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getUser = async (filters,relations) => {
        try {
            const user = await this.userRepository.findOne({ where: filters, relations : relations});
            return (user);            
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public getUserByUsername = async (username: string) => {
        const user = await this.userRepository.findOne({ where: {name : username},select : ["id","name","password"], relations : ["profile","groups","companies","profile.functionalities"]});
        return (user);
    }




    public getUsers = async (filters: FindUserDto[], limit, offset) => {
        try {
            const users = await this.userRepository.findAndCount({where:filters, relations: ["profile","companies","groups"]});
            return(users);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23503":
                    throw new Error("Reference is missing")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public modifyUser = async (id: number, userData: UpdateUserDto) => {
        try {
            var user: User = await this.userRepository.findOne(id);
            if (user) {
                    const modifyedUser = await this.userRepository.save(Object.assign(user,userData))
                    return (modifyedUser);
            } else {
                return (null)
            }
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23505":
                    throw new Error("User already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public deleteUser = async (id: number) => {
        try {
            const deletedUser = await this.userRepository.delete(id);
            return (deletedUser);
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }





}


export default UserService;
