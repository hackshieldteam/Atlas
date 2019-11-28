import { getRepository } from 'typeorm';
import Profile from './profile.entity';
import { CreateProfileDto, UpdateProfileDto, FindProfileDto } from './profile.dto';
import { modifyEntries } from '../../utils/modifyEntries';


class ProfileService {
    private profileRepository = getRepository(Profile);

    public addProfile = async (profileData: CreateProfileDto) => {
        try {
            const newProfile = await this.profileRepository.save(profileData);
            return (newProfile);
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

    public getProfile = async (id: number) => {
        try {
            const profile = await this.profileRepository.findOne({ where: { id: id }, relations: ["functionalities"] });
            return (profile)
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

    public getProfiles = async (filters, limit, offset) => {
        try {
            const profiles  = await this.profileRepository.findAndCount({where : filters, relations : ["users"]});
            return(profiles);      
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                default:
                    throw new Error("Unknown error");
            }
        }
    }

    public modifyProfile = async (id, profileData: UpdateProfileDto) => {
        try {
            var profile : Profile = await this.profileRepository.findOne(id)
            if (profile) {
                    const updatedProfile = await this.profileRepository.save(Object.assign(profile,profileData));
                    return(updatedProfile)  
            } else {
                return (null)
            }    
        } catch (error) {
            switch (error.code) {
                case "42601":
                        throw new Error("Syntax error")
                case "23505":
                    throw new Error("Company already exist")
                default:
                    throw new Error("Unknown error");
            }
        }      
    }
    public deleteProfile = async (id) => {
        try {
            const deletedProfile = await this.profileRepository.delete(id);
            return (deletedProfile);
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

export default ProfileService;
