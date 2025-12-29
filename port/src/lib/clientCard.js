const DEFAULT_VEC3 = { x: 0, y: 0, z: 0 };

export class ClientCard {
  constructor() {
    this.owner = 0;
    this.controler = 0;
    this.location = 0;
    this.sequence = 0;
    this.position = 0;
    this.code = 0;
    this.chain_code = 0;
    this.opParam = 0;
    this.overlayed = [];
    this.overlayTarget = null;
    this.is_reversed = false;
    this.is_selectable = false;
    this.is_selected = false;
    this.is_public = false;
    this.is_hovered = false;
    this.cmdFlag = 0;
    this.curPos = { ...DEFAULT_VEC3 };
    this.curRot = { ...DEFAULT_VEC3 };
    this.dPos = { ...DEFAULT_VEC3 };
    this.dRot = { ...DEFAULT_VEC3 };
    this.curAlpha = 1;
    this.dAlpha = 0;
    this.is_moving = false;
    this.is_fading = false;
    this.aniFrame = 0;
  }

  UpdateInfo(info) {
    if (!info || typeof info !== 'object') {
      return;
    }
    Object.assign(this, info);
  }

  UpdateDrawCoordinates() {
    // UI layer should update positions based on layout/scene state.
  }

  static client_card_sort(a, b) {
    if (a.location !== b.location) return a.location - b.location;
    return a.sequence - b.sequence;
  }
}
