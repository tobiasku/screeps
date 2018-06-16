var helperCreep = require('helper.creep');

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        helperCreep.creepTask(creep)
        if (helperCreep.needHeal(creep)) {
            return
        }
        if (helperCreep.goToTargetRoom(creep)) {
            return
        }

        if (!creep.memory.work) {
            var targets1 = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_LINK) &&
                        structure.energy > (structure.energy / 0.75)
                }
            });
            var targets2 = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.energy > creep.carryCapacity
                }
            });
            var targets = targets1.concat(targets2)
            var target
            if (targets.length == 0) {
                target = creep.room.storage
            }
            else {
                target = creep.pos.findClosestByPath(targets)
            }
        
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        }
        else {
            if (creep.memory.isTransporting && creep.memory.destination) {
                var target = Game.getObjectById(creep.memory.destination)
                if (target) {
                    if (target.energy >= target.energyCapacity) {
                        creep.memory.destination = ''
                    }
                }
                
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }

            let tower = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_TOWER && structure.energy < structure.energyCapacity
            })
            if (tower){
                creep.memory.isTransporting = true
                creep.memory.destination = tower.id
                return 
            }

            let spawn = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_SPAWN && structure.energy < structure.energyCapacity
            })
            if (spawn){
                creep.memory.isTransporting = true
                creep.memory.destination = spawn.id
                return 
            }

            let extension = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
            })
            if (extension){
                creep.memory.isTransporting = true
                creep.memory.destination = extension.id
                return 
            }

            let storage = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_STORAGE && structure.store.energy < structure.storeCapacity
            })
            if (storage){
                creep.memory.isTransporting = true
                creep.memory.destination = storage.id
                return 
            }
        }
    }
};