var helperCreep = require('helper.creep')
var roleBuilder = require('role.builder')

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
            helperCreep.creepGetEnergyFromStructure(creep)
        }
        else {
            if (creep.memory.isRepairing && creep.memory.destination) {
                var target = Game.getObjectById(creep.memory.destination)
                if (target && ((target.structureType === STRUCTURE_WALL || target.structureType == STRUCTURE_RAMPART) && target.hits > 10000) ||
                    target.hits >= target.hitsMax) {
                    creep.memory.destination = ''
                }

                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target)
                }
            }

            let endangeredRoad = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_ROAD && structure.hits < 5000
            })
            if(endangeredRoad){
                creep.memory.isRepairing = true
                creep.memory.destination = endangeredRoad.id
                return 
            }

            let endangeredWall = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_WALL && structure.hits < 20000
            })
            if(endangeredWall){
                creep.memory.isRepairing = true
                creep.memory.destination = endangeredWall.id
                return 
            }

            let endangeredRampart = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_RAMPART && structure.hits < 20000
            })
            if(endangeredRampart){
                creep.memory.isRepairing = true
                creep.memory.destination = endangeredRampart.id
                return 
            }

            let endangeredContainer = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: structure => structure.structureType === STRUCTURE_CONTAINER && structure.hits < 5000
            })
            if(endangeredContainer){
                creep.memory.isRepairing = true
                creep.memory.destination = endangeredContainer.id
                return 
            }

            let closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES,{
                filter: (structure) => {
                    if(structure.structureType === STRUCTURE_ROAD){
                        return false
                    }
                    if(structure.structureType === STRUCTURE_CONTAINER){
                        return false
                    }
                    if(structure.structureType === STRUCTURE_WALL 
                    || structure.structureType === STRUCTURE_RAMPART){
                        //return structure.hits < 1000000
                        return structure.hits < 10000
                    }
                    return structure.hits < structure.hitsMax
                }
            })
            if(closestDamagedStructure) {
                creep.memory.isRepairing = true
                creep.memory.destination = closestDamagedStructure.id
                return
            }

            roleBuilder.run(creep)
        }
    }
};