import { Like, In } from "typeorm";

function modifyEntriesAux(obj) {
    Object.entries(obj).forEach(function (entry) {
        if (typeof (entry[1]) == 'string') {
            obj[entry[0]] = Like("%" + entry[1] + "%")
        } else if (typeof (entry[1]) == 'object') {
            modifyEntries(entry[1])
        } else if (Array.isArray(entry[1])) {
            modifyEntries(entry[1])
        }
    })
}
//[{ name : "p2"}, { name : "p3" }, { url : { urlName : "www.as.com" } } ]
function modifyEntries(obj) {
    var i = 0;
    for (i = 0; i < obj.length; i++) {
        Object.entries(obj[i]).forEach((entry) => {
            if (typeof (entry[1]) == 'string') {
                obj[i][entry[0]] = Like("%" + entry[1] + "%")
            } else if (typeof (entry[1]) == 'object') {
                modifyEntriesAux(entry[1])
            } else if (Array.isArray(entry[1])) {
                modifyEntries(entry[1])
            }
        })
    }
}

function addCompanyFilter(obj, companies) {
    if (obj.length == 0) {
        obj.push({ company: In(companies) })
    } else {
        var i = 0;
        for (i = 0; i < obj.length; i++) {
            obj[i].company = In(companies)
        }
    }
}

function addGroupFilter(obj,groups){
    if (obj.length == 0) {
        obj.push({ groups: In(groups) })
    } else {
        var i = 0;
        for (i = 0; i < obj.length; i++) {
            obj[i].groups = In(groups)
        }
    }
}

export {
    modifyEntries,
    addCompanyFilter
}

