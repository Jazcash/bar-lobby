<template>
    <div class="playerlist" :class="{ dragging: draggedParticipant !== null }">
        <div
            v-for="(team, teamId) in battle.teams.value"
            :key="`team${teamId}`"
            class="group"
            data-type="group"
            @dragenter.prevent="dragEnter($event, teamId)"
            @dragover.prevent
            @dragleave.prevent="dragLeave($event, teamId)"
            @drop="onDrop($event, teamId)"
        >
            <div class="flex-row gap-md">
                <div class="title">Team {{ teamId + 1 }}</div>
                <Button slim :flexGrow="false" @click="addBot(teamId)"> Add bot </Button>
                <Button v-if="me.battleStatus.isSpectator || me.battleStatus.teamId !== teamId" slim :flexGrow="false" @click="joinTeam(teamId)"> Join </Button>
            </div>
            <div class="participants">
                <div
                    v-for="(contender, contenderIndex) in battle.getTeamParticipants(teamId)"
                    :key="`contender${contenderIndex}`"
                    draggable
                    @dragstart="dragStart($event, contender)"
                    @dragend="dragEnd($event, contender)"
                >
                    <Participant :battle="battle" :participant="contender" />
                </div>
            </div>
        </div>
        <div
            class="group"
            data-type="group"
            @dragenter.prevent="dragEnter($event, battle.teams.value.size)"
            @dragover.prevent
            @dragleave.prevent="dragLeave($event, battle.teams.value.size)"
            @drop="onDrop($event, battle.teams.value.size)"
        >
            <div class="flex-row gap-md">
                <div class="title">Team {{ battle.teams.value.size + 1 }}</div>
                <Button slim :flexGrow="false" @click="addBot(battle.teams.value.size)"> Add bot </Button>
                <Button slim :flexGrow="false" @click="joinTeam(battle.teams.value.size)"> Join </Button>
            </div>
        </div>
        <div class="group" data-type="group" @dragenter.prevent="dragEnter($event)" @dragover.prevent @dragleave.prevent="dragLeave($event)" @drop="onDrop($event)">
            <div class="flex-row gap-md">
                <div class="title">Spectators</div>
                <Button v-if="!me.battleStatus.isSpectator" slim :flexGrow="false" @click="joinTeam()"> Join </Button>
            </div>
            <div class="participants">
                <div
                    v-for="(spectator, spectatorIndex) in battle.spectators.value"
                    :key="`spectator${spectatorIndex}`"
                    draggable
                    @dragstart="dragStart($event, spectator)"
                    @dragend="dragEnd($event, spectator)"
                >
                    <Participant :battle="battle" :participant="spectator" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { randomFromArray } from "jaz-ts-utils";
import { Ref, ref } from "vue";

import Participant from "@/components/battle/Participant.vue";
import Button from "@/components/inputs/Button.vue";
import { aiNames } from "@/config/ai-names";
import { AbstractBattle } from "@/model/battle/abstract-battle";
import { Bot, Faction } from "@/model/battle/types";
import { User } from "@/model/user";

const props = defineProps<{
    battle: AbstractBattle;
}>();

const me = api.session.currentUser;

const addBot = (teamId: number) => {
    let randomName = randomFromArray(aiNames);
    while (props.battle.bots.some((bot) => bot.name === randomName)) {
        randomName = randomFromArray(aiNames);
    }

    props.battle.addParticipant({
        playerId: props.battle.contenders.value.length,
        teamId,
        name: randomName!,
        aiShortName: "BARb",
        faction: Faction.Armada,
        ownerUserId: api.session.currentUser.userId,
        aiOptions: {},
    });
};

const joinTeam = (teamId?: number) => {
    if (me.battleStatus.isSpectator && teamId !== undefined) {
        props.battle.spectatorToPlayer(me, teamId);
    } else if (!me.battleStatus.isSpectator && teamId === undefined) {
        props.battle.playerToSpectator(me);
    } else if (!me.battleStatus.isSpectator && teamId !== undefined) {
        props.battle.changeContenderTeam(me, teamId);
    }
};

let draggedParticipant: Ref<User | Bot | null> = ref(null);
let draggedEl: Element | null = null;

const dragEnter = (event: DragEvent, teamId?: number) => {
    if (!draggedParticipant.value) {
        return;
    }

    const target = event.target as HTMLElement;
    const groupEl = target.closest("[data-type=group]");
    if (draggedEl && groupEl) {
        document.querySelectorAll("[data-type=group]").forEach((el) => {
            el.classList.remove("highlight");
        });
    }

    const draggingContenderToOwnTeam =
        ("userId" in draggedParticipant.value && !draggedParticipant.value.battleStatus.isSpectator && draggedParticipant.value.battleStatus.teamId === teamId) ||
        (!("userId" in draggedParticipant.value) && draggedParticipant.value.teamId === teamId);
    const draggingSpectatorToSpectator = "userId" in draggedParticipant.value && draggedParticipant.value.battleStatus.isSpectator && teamId === undefined;
    const draggingBotToSpectator = !("userId" in draggedParticipant.value) && teamId === undefined;
    console.log(draggingContenderToOwnTeam, draggingSpectatorToSpectator, draggingBotToSpectator);
    if (draggingContenderToOwnTeam || draggingSpectatorToSpectator || draggingBotToSpectator) {
        // TODO: disable drag cursor
        return;
    }

    if (groupEl) {
        groupEl.classList.add("highlight");
    }
};

const dragLeave = (event: DragEvent, teamId?: number) => {
    if (!draggedParticipant.value) {
        return;
    }

    const draggingContenderToOwnTeam =
        ("userId" in draggedParticipant.value && !draggedParticipant.value.battleStatus.isSpectator && draggedParticipant.value.battleStatus.teamId === teamId) ||
        (!("userId" in draggedParticipant.value) && draggedParticipant.value.teamId === teamId);
    const draggingSpectatorToSpectator = "userId" in draggedParticipant.value && draggedParticipant.value.battleStatus.isSpectator && teamId === undefined;
    const draggingBotToSpectator = !("userId" in draggedParticipant.value) && teamId === undefined;
    if (draggingContenderToOwnTeam || draggingSpectatorToSpectator || draggingBotToSpectator) {
        // TODO: disable drag cursor
        return;
    }
};

const dragStart = (event: DragEvent, participant: User | Bot) => {
    draggedParticipant.value = participant;
    draggedEl = event.target as Element;
    const participantEl = draggedEl?.querySelector("[data-type=participant]");
    if (participantEl) {
        participantEl.classList.add("dragging");
    }
};

const dragEnd = (event: DragEvent, participant: User | Bot) => {
    const participantEl = draggedEl?.querySelector("[data-type=participant]");
    if (participantEl) {
        participantEl.classList.remove("dragging");
    }
    draggedParticipant.value = null;
    draggedEl = null;

    document.querySelectorAll("[data-type=group]").forEach((el) => {
        el.classList.remove("highlight");
    });
};

const onDrop = (event: DragEvent, teamId?: number) => {
    const target = event.target as Element;
    if (target.getAttribute("data-type") === "group" && draggedParticipant.value) {
        // const participantName = !("userId" in draggedParticipant.value) ? draggedParticipant.value.name : api.session.getUserById(draggedParticipant.value.userId)?.username;
        // if (!participantName) {
        //     return;
        // }
        if (teamId !== undefined && (("userId" in draggedParticipant.value && !draggedParticipant.value.battleStatus.isSpectator) || !("userId" in draggedParticipant.value))) {
            props.battle.changeContenderTeam(draggedParticipant.value, teamId);
        } else if ("userId" in draggedParticipant.value && !draggedParticipant.value.battleStatus.isSpectator) {
            props.battle.playerToSpectator(draggedParticipant.value);
        } else if (teamId !== undefined && "userId" in draggedParticipant.value && draggedParticipant.value.battleStatus.isSpectator) {
            props.battle.spectatorToPlayer(draggedParticipant.value, teamId);
        }
    }
};
</script>

<style lang="scss" scoped>
.playerlist {
    display: flex;
    flex-direction: column;
    &.dragging .group > * {
        pointer-events: none;
    }
}
.group {
    position: relative;
    &:not(:last-child):after {
        content: "";
        display: flex;
        background: rgba(255, 255, 255, 0.1);
        width: 100%;
        height: 1px;
        margin: 10px 0;
    }
    &.highlight {
        &:before {
            @extend .fullsize;
            width: calc(100% + 10px);
            height: calc(100%);
            left: -5px;
            top: -5px;
            background: rgba(255, 255, 255, 0.1);
        }
    }
}
.title {
    font-size: 26px;
}
.participants {
    display: flex;
    flex-direction: row;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 5px;
}
</style>
