var helperCreep = require('helper.creep')

var roleBuilder = require('role.builder')

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
        helperCreep.creepTask(creep)
        if (helperCreep.needHeal(creep)) {
            return
        }

        if (!creep.memory.work) {
            if (creep.memory.role == 'longDistanceHarvester') {
                if (helperCreep.goToTargetRoom(creep)) {
                    return
                }
            }
            helperCreep.creepHarvest(creep)
        }
        else {
            if (creep.memory.role == 'longDistanceHarvester') {
                if (helperCreep.goToHomeRoom(creep)) {
                    return
                }
            }

            if (creep.memory.destination) {
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

            roleBuilder.run(creep)
        }
    }
};