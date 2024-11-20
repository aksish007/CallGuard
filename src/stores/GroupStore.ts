import { Observable } from '@nativescript/core';
import { Group } from '../types/Group';
import { CallBlockerService } from '../services/CallBlockerService';

export class GroupStore extends Observable {
  private static instance: GroupStore;
  private _groups: Group[] = [];

  private constructor() {
    super();
    this._groups = [
      {
        id: "1",
        name: "Spam Callers",
        isEnabled: true,
        contacts: [
          { id: "1", name: "Spam 1", phoneNumber: "+1234567890" },
          { id: "2", name: "Spam 2", phoneNumber: "+1234567891" }
        ]
      },
      {
        id: "2",
        name: "Telemarketers",
        isEnabled: false,
        contacts: [
          { id: "3", name: "Telemarketer 1", phoneNumber: "+1234567892" }
        ]
      }
    ];
  }

  public static getInstance(): GroupStore {
    if (!GroupStore.instance) {
      GroupStore.instance = new GroupStore();
    }
    return GroupStore.instance;
  }

  get groups(): Group[] {
    return this._groups;
  }

  public addGroup(name: string): void {
    const newGroup: Group = {
      id: Date.now().toString(),
      name,
      isEnabled: true,
      contacts: []
    };
    this._groups.push(newGroup);
    this.notifyPropertyChange('groups', this._groups);
    this.updateCallBlocker();
  }

  public toggleGroup(groupId: string): void {
    const group = this._groups.find(g => g.id === groupId);
    if (group) {
      group.isEnabled = !group.isEnabled;
      this.notifyPropertyChange('groups', this._groups);
      this.updateCallBlocker();
    }
  }

  private updateCallBlocker(): void {
    CallBlockerService.getInstance().updateBlockedGroups(this._groups);
  }
}