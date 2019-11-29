import { getRepository } from 'typeorm';
import { CreateDepartmentDto, UpdateDepartmentDto, FindDepartmentDto } from './department.dto';
import Area from '../../entities/area.entity';
import Department from '../../entities/department.entity';
import { modifyEntries } from '../../utils/modifyEntries';



class DepartmentService {
    private departmentRepository = getRepository(Department)

    public addDepartment = async (departmentData: CreateDepartmentDto) => {
        try {
                const department = await this.departmentRepository.save(departmentData);
                return (department); 
        } catch (error) {
            switch (error.code) {
                case "23503":
                    throw new Error("Reference is missing")
                case "23505":
                    throw new Error("Department already exist")
                default:
                    throw new Error(error.message);
            }
        }
    }

    public getDepartment = async (id: number) => {
        const department = await this.departmentRepository.findOne(id);
        return (department);
    }

    public getDepartmentAssets = async (id: number) => {
        const department: Department = await this.departmentRepository.findOne({ where: { id: id }, select: ["assets"], relations: ["asset"] })
        if (department) {
            return (department.assets)
        } else return (null);
    }


    public getDepartments = async (filters: FindDepartmentDto[], limit, offset) => {
        modifyEntries(filters)
        const departments : Department[] = await this.departmentRepository.find({where : filters})
        return (departments);
        /*let qb = this.departmentRepository.createQueryBuilder("department");

        var i = 0;
        var querystrings = [];
        var queryobjs = [];
        filters.forEach(filter => {
            let obj = {};
            var query = []
            Object.keys(filter).forEach(param => {
                switch (param) {
                    case "name":
                        query.push("department.name LIKE :name" + i)
                        obj["name" + i] = "%" + filter[param] + "%"
                        break;
                    default:
                        break;
                }
            })
            i++;
            queryobjs.push(obj)
            querystrings.push(query.join(" AND "));
        })
        var i = 0;
        for (i = 0; i < queryobjs.length; i++) {
            qb.orWhere(querystrings[i], queryobjs[i])
        }

        qb.take(limit)
        qb.skip(offset)
        const departments = qb.getMany();
        return departments;*/
    }

    public modifyDepartment = async (id: number, departmentData: UpdateDepartmentDto) => {
        var department: Department = await this.departmentRepository.findOne(id);
        if (department) {
//            department.name = departmentData.name || department.name;
            const updateDepartment = await this.departmentRepository.save(Object.assign(department,departmentData));
            return (updateDepartment);
        } else {
            return (null)
        }
    }

    public deleteDepartment = async (id: number) => {
        const deletedDepartment = await this.departmentRepository.delete(id);
        return (deletedDepartment);
    }





}


export default DepartmentService;
