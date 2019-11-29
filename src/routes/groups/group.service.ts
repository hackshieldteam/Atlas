import { getRepository, Like, In } from 'typeorm';
import Group from '../../entities/group.entity';
import { CreateGroupDto, UpdateGroupDto, FindGroupDto } from './group.dto';
import { modifyEntries, addCompanyFilter } from '../../utils/modifyEntries';


class GroupService {
    private groupRepository = getRepository(Group);

    public addGroup = async (groupData: CreateGroupDto) => {
        try {
            const group = await this.groupRepository.save(groupData);
            return (group);
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Group already exist")
                default:
                    throw new Error("Unknown error");
            }
        }
    }
    public getGroup = async (filters,relations) => {
        const group = await this.groupRepository.findOne({ where: filters, relations: relations });
        return (group)
    }
    public getGroupAssets = async (id: number) => {
        const group = await this.groupRepository.findOne({ where: { id: id }, relations: ["assets"] });
        if(group){
            return(group.assets);
        }else return(null)
    }
    public getGroupUsers = async (id: number) => {
        const group = await this.groupRepository.findOne({ where: { id: id }, relations: ["users"] });
        if(group){
            return(group.users);
        }else return(null)
    }
    public getGroups = async (filters, limit, offset) => {
       const groups : Group[] = await this.groupRepository.find({where : filters})
       return(groups)
    }
    public modifyGroup = async (filters,groupData: UpdateGroupDto) => {
        var group : Group = await this.groupRepository.findOne({ where : filters})
        if (group) {
            try {
                const updatedGroup = await this.groupRepository.save(Object.assign(group,groupData));
                return(updatedGroup)
            } catch (error) {
                switch (error.code) {
                    case "23503":
                        throw new Error("Reference is missing")
                    default:
                        throw new Error("Unknown error");
                }
            }
        } else {
            return (null)
        }
    }
    public deleteGroup = async (id) => {
            const deletedGroup = await this.groupRepository.delete(id);
            return (deletedGroup);
    }
}

export default GroupService;
