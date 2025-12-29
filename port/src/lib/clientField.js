import { ClientCard } from './clientCard';

export const LOCATION_DECK = 0x01;
export const LOCATION_HAND = 0x02;
export const LOCATION_MZONE = 0x04;
export const LOCATION_SZONE = 0x08;
export const LOCATION_GRAVE = 0x10;
export const LOCATION_REMOVED = 0x20;
export const LOCATION_EXTRA = 0x40;
export const LOCATION_OVERLAY = 0x80;
export const LOCATION_SKILL = 0x100;

export const POS_FACEUP = 0x1;
export const POS_FACEDOWN = 0x2;
export const POS_ATTACK = 0x4;
export const POS_DEFENSE = 0x8;
export const POS_FACEDOWN_DEFENSE = POS_FACEDOWN | POS_DEFENSE;

const DEFAULT_VEC3 = { x: 0, y: 0, z: 0 };

const OPCODE = {
  ADD: 0x40000000,
  SUB: 0x40000001,
  MUL: 0x40000002,
  DIV: 0x40000003,
  AND: 0x40000004,
  OR: 0x40000005,
  NEG: 0x40000006,
  NOT: 0x40000007,
  BAND: 0x40000008,
  BOR: 0x40000009,
  BNOT: 0x4000000a,
  BXOR: 0x4000000b,
  LSHIFT: 0x4000000c,
  RSHIFT: 0x4000000d,
  ISCODE: 0x4000000e,
  ISTYPE: 0x4000000f,
  ISRACE: 0x40000010,
  ISATTRIBUTE: 0x40000011,
  GETCODE: 0x40000012,
  GETTYPE: 0x40000013,
  GETRACE: 0x40000014,
  GETATTRIBUTE: 0x40000015,
  ISSETCARD: 0x40000016,
  ALLOW_ALIASES: 0x40000017,
  ALLOW_TOKENS: 0x40000018
};

export class ClientField {
  constructor(options = {}) {
    this.callbacks = options.callbacks || {};
    this.config = options.config || { topdown_view: false };
    this.cardDatabase = options.cardDatabase || new Map();

    this.panel = null;
    this.hovered_card = null;
    this.clicked_card = null;
    this.highlighting_card = null;
    this.hovered_controler = 0;
    this.hovered_location = 0;
    this.hovered_sequence = 0;
    this.selectable_field = 0;
    this.selected_field = 0;

    this.deck_act = [false, false];
    this.grave_act = [false, false];
    this.remove_act = [false, false];
    this.extra_act = [false, false];
    this.pzone_act = [false, false];
    this.conti_act = false;
    this.deck_reversed = false;
    this.conti_selecting = false;

    this.skills = [null, null];
    this.mzone = [Array(7).fill(null), Array(7).fill(null)];
    this.szone = [Array(8).fill(null), Array(8).fill(null)];
    this.deck = [[], []];
    this.hand = [[], []];
    this.grave = [[], []];
    this.remove = [[], []];
    this.extra = [[], []];
    this.limbo_temp = [];
    this.overlay_cards = [];
    this.extra_p_count = [0, 0];
    this.player_desc_hints = [[], []];

    this.chains = [];
    this.activatable_cards = [];
    this.queued_panel_confirm_cards = [];
    this.summonable_cards = [];
    this.spsummonable_cards = [];
    this.msetable_cards = [];
    this.ssetable_cards = [];
    this.reposable_cards = [];
    this.attackable_cards = [];
    this.sort_list = [];
    this.disabled_field = 0;

    this.selectable_cards = [];
    this.selected_cards = [];
    this.must_select_cards = [];
    this.selectsum_cards = new Set();
    this.selectsum_all = [];
    this.select_sumval = 0;
    this.select_min = 0;
    this.select_max = 0;
    this.must_select_count = 0;
    this.select_mode = 0;
    this.select_ready = false;

    this.display_cards = [];
    this.conti_cards = [];
    this.declare_opcodes = [];
    this.ancard = [];

    this.chain_forced = false;
  }

  Clear() {
    const clearVector = (arr) => {
      arr.length = 0;
    };

    for (let i = 0; i < 2; i += 1) {
      clearVector(this.mzone[i]);
      clearVector(this.szone[i]);
      this.mzone[i] = Array(7).fill(null);
      this.szone[i] = Array(8).fill(null);
      clearVector(this.deck[i]);
      clearVector(this.hand[i]);
      clearVector(this.grave[i]);
      clearVector(this.remove[i]);
      clearVector(this.extra[i]);
    }
    clearVector(this.limbo_temp);
    clearVector(this.overlay_cards);
    this.skills = [null, null];
    this.extra_p_count = [0, 0];
    this.player_desc_hints = [[], []];
    clearVector(this.chains);
    clearVector(this.activatable_cards);
    clearVector(this.queued_panel_confirm_cards);
    clearVector(this.summonable_cards);
    clearVector(this.spsummonable_cards);
    clearVector(this.msetable_cards);
    clearVector(this.ssetable_cards);
    clearVector(this.reposable_cards);
    clearVector(this.attackable_cards);
    clearVector(this.sort_list);
    this.disabled_field = 0;
    this.panel = null;
    this.hovered_card = null;
    this.clicked_card = null;
    this.highlighting_card = null;
    this.hovered_controler = 0;
    this.hovered_location = 0;
    this.hovered_sequence = 0;
    this.selectable_field = 0;
    this.selected_field = 0;
    this.deck_act = [false, false];
    this.grave_act = [false, false];
    this.remove_act = [false, false];
    this.extra_act = [false, false];
    this.pzone_act = [false, false];
    this.conti_act = false;
    this.conti_selecting = false;
    this.deck_reversed = false;
  }

  Initial(player, deckc, extrac) {
    for (let i = 0; i < deckc; i += 1) {
      const card = new ClientCard();
      card.owner = player;
      card.controler = player;
      card.location = LOCATION_DECK;
      card.sequence = i;
      card.position = POS_FACEDOWN_DEFENSE;
      card.UpdateDrawCoordinates(true);
      this.deck[player].push(card);
    }
    for (let i = 0; i < extrac; i += 1) {
      const card = new ClientCard();
      card.owner = player;
      card.controler = player;
      card.location = LOCATION_EXTRA;
      card.sequence = i;
      card.position = POS_FACEDOWN_DEFENSE;
      card.UpdateDrawCoordinates(true);
      this.extra[player].push(card);
    }
  }

  GetList(location, controler) {
    switch (location) {
      case LOCATION_DECK:
        return this.deck[controler];
      case LOCATION_HAND:
        return this.hand[controler];
      case LOCATION_MZONE:
        return this.mzone[controler];
      case LOCATION_SZONE:
        return this.szone[controler];
      case LOCATION_GRAVE:
        return this.grave[controler];
      case LOCATION_REMOVED:
        return this.remove[controler];
      case LOCATION_EXTRA:
        return this.extra[controler];
      default:
        return null;
    }
  }

  GetCard(controler, location, sequence, sub_seq = 0) {
    const is_xyz = (location & LOCATION_OVERLAY) !== 0;
    const list = this.GetList(location & ~LOCATION_OVERLAY, controler);
    if (!list || sequence >= list.length) return null;
    if (is_xyz) {
      const parent = list[sequence];
      if (parent && parent.overlayed.length > sub_seq) {
        return parent.overlayed[sub_seq];
      }
      return null;
    }
    return list[sequence];
  }

  AddCard(pcard, controler, location, sequence) {
    pcard.controler = controler;
    pcard.location = location;
    pcard.sequence = sequence;
    switch (location) {
      case LOCATION_DECK: {
        if (sequence !== 0 || this.deck[controler].length === 0) {
          this.deck[controler].push(pcard);
          pcard.sequence = this.deck[controler].length - 1;
        } else {
          this.deck[controler].push(null);
          for (let i = this.deck[controler].length - 1; i > 0; i -= 1) {
            this.deck[controler][i] = this.deck[controler][i - 1];
            this.deck[controler][i].sequence += 1;
          }
          this.deck[controler][0] = pcard;
          pcard.sequence = 0;
        }
        pcard.is_reversed = false;
        break;
      }
      case LOCATION_HAND: {
        this.hand[controler].push(pcard);
        pcard.sequence = this.hand[controler].length - 1;
        break;
      }
      case LOCATION_MZONE: {
        this.mzone[controler][sequence] = pcard;
        break;
      }
      case LOCATION_SZONE: {
        this.szone[controler][sequence] = pcard;
        break;
      }
      case LOCATION_GRAVE: {
        this.grave[controler].push(pcard);
        pcard.sequence = this.grave[controler].length - 1;
        break;
      }
      case LOCATION_REMOVED: {
        this.remove[controler].push(pcard);
        pcard.sequence = this.remove[controler].length - 1;
        break;
      }
      case LOCATION_EXTRA: {
        if (this.extra_p_count[controler] === 0 || (pcard.position & POS_FACEUP)) {
          this.extra[controler].push(pcard);
          pcard.sequence = this.extra[controler].length - 1;
        } else {
          this.extra[controler].push(null);
          const p = this.extra[controler].length - this.extra_p_count[controler] - 1;
          for (let i = this.extra[controler].length - 1; i > p; i -= 1) {
            this.extra[controler][i] = this.extra[controler][i - 1];
            this.extra[controler][i].sequence += 1;
          }
          this.extra[controler][p] = pcard;
          pcard.sequence = p;
        }
        if (pcard.position & POS_FACEUP) this.extra_p_count[controler] += 1;
        break;
      }
      default:
        break;
    }
  }

  RemoveCard(controler, location, sequence) {
    const removeFromPile = (pile) => {
      const pcard = pile[controler][sequence];
      for (let i = sequence; i < pile[controler].length - 1; i += 1) {
        pile[controler][i] = pile[controler][i + 1];
        pile[controler][i].sequence -= 1;
      }
      pile[controler].pop();
      return pcard;
    };

    let pcard = null;
    switch (location) {
      case LOCATION_DECK:
        pcard = removeFromPile(this.deck);
        break;
      case LOCATION_HAND: {
        pcard = this.hand[controler][sequence];
        for (let i = sequence; i < this.hand[controler].length - 1; i += 1) {
          this.hand[controler][i] = this.hand[controler][i + 1];
          this.hand[controler][i].sequence -= 1;
        }
        this.hand[controler].pop();
        break;
      }
      case LOCATION_MZONE:
        pcard = this.mzone[controler][sequence];
        this.mzone[controler][sequence] = null;
        break;
      case LOCATION_SZONE:
        pcard = this.szone[controler][sequence];
        this.szone[controler][sequence] = null;
        break;
      case LOCATION_GRAVE:
        pcard = removeFromPile(this.grave);
        break;
      case LOCATION_REMOVED:
        pcard = removeFromPile(this.remove);
        break;
      case LOCATION_EXTRA:
        pcard = removeFromPile(this.extra);
        if (pcard && (pcard.position & POS_FACEUP)) this.extra_p_count[controler] -= 1;
        break;
      default:
        break;
    }
    if (pcard) pcard.location = 0;
    return pcard;
  }

  UpdateCard(controler, location, sequence, data) {
    const card = this.GetCard(controler, location, sequence);
    if (card) {
      card.UpdateInfo(data);
    }
  }

  UpdateFieldCard(controler, location, data) {
    const list = this.GetList(location, controler);
    if (!list || !Array.isArray(data)) return;
    list.forEach((card, idx) => {
      if (card && data[idx]) {
        card.UpdateInfo(data[idx]);
      }
    });
  }

  ClearCommandFlag() {
    const clearFlag = (list) => list.forEach((card) => {
      card.cmdFlag = 0;
    });
    clearFlag(this.activatable_cards);
    clearFlag(this.summonable_cards);
    clearFlag(this.spsummonable_cards);
    clearFlag(this.msetable_cards);
    clearFlag(this.ssetable_cards);
    clearFlag(this.reposable_cards);
    clearFlag(this.attackable_cards);
    this.conti_cards = [];
    this.deck_act = [false, false];
    this.grave_act = [false, false];
    this.remove_act = [false, false];
    this.extra_act = [false, false];
    this.pzone_act = [false, false];
    this.conti_act = false;
  }

  ClearSelect() {
    this.selectable_cards.forEach((card) => {
      card.is_selectable = false;
      card.is_selected = false;
    });
  }

  ClearChainSelect() {
    this.activatable_cards.forEach((card) => {
      card.cmdFlag = 0;
      card.chain_code = 0;
      card.is_selectable = false;
      card.is_selected = false;
    });
    this.conti_cards = [];
    this.deck_act = [false, false];
    this.grave_act = [false, false];
    this.remove_act = [false, false];
    this.extra_act = [false, false];
    this.pzone_act = [false, false];
    this.conti_act = false;
  }

  ShowSelectCard(buttonok = false) {
    if (this.callbacks.onShowSelectCard) {
      this.callbacks.onShowSelectCard({
        buttonok,
        selectableCards: this.selectable_cards
      });
    }
  }

  ShowChainCard() {
    if (this.callbacks.onShowChainCard) {
      this.callbacks.onShowChainCard({
        selectableCards: this.selectable_cards,
        chainForced: this.chain_forced
      });
    }
  }

  ShowLocationCard() {
    if (this.callbacks.onShowLocationCard) {
      this.callbacks.onShowLocationCard({
        displayCards: this.display_cards
      });
    }
  }

  ShowSelectOption(select_hint, should_lock) {
    if (this.callbacks.onShowSelectOption) {
      this.callbacks.onShowSelectOption({ select_hint, should_lock });
    }
  }

  ReplaySwap() {
    this.deck_reversed = !this.deck_reversed;
    if (this.callbacks.onReplaySwap) {
      this.callbacks.onReplaySwap(this.deck_reversed);
    }
  }

  RefreshAllCards() {
    const refreshList = (list) => list.forEach((card) => {
      if (card) card.UpdateDrawCoordinates();
    });
    refreshList(this.deck[0]);
    refreshList(this.deck[1]);
    refreshList(this.hand[0]);
    refreshList(this.hand[1]);
    refreshList(this.grave[0]);
    refreshList(this.grave[1]);
    refreshList(this.remove[0]);
    refreshList(this.remove[1]);
    refreshList(this.extra[0]);
    refreshList(this.extra[1]);
    this.mzone.flat().forEach((card) => {
      if (card) card.UpdateDrawCoordinates();
    });
    this.szone.flat().forEach((card) => {
      if (card) card.UpdateDrawCoordinates();
    });
  }

  GetChainDrawCoordinates() {
    return { ...DEFAULT_VEC3 };
  }

  RefreshHandHitboxes() {
    if (this.callbacks.onRefreshHandHitboxes) {
      this.callbacks.onRefreshHandHitboxes();
    }
  }

  GetCardDrawCoordinates(pcard) {
    if (!pcard) return { t: { ...DEFAULT_VEC3 }, r: { ...DEFAULT_VEC3 } };
    if (this.callbacks.getCardDrawCoordinates) {
      return this.callbacks.getCardDrawCoordinates(pcard);
    }
    return { t: { ...pcard.curPos }, r: { ...pcard.curRot } };
  }

  MoveCard(pcard, frame) {
    if (!pcard) return;
    const milliseconds = (frame * 1000) / 60;
    const { t, r } = this.GetCardDrawCoordinates(pcard);
    pcard.dPos = {
      x: (t.x - pcard.curPos.x) / milliseconds,
      y: (t.y - pcard.curPos.y) / milliseconds,
      z: (t.z - pcard.curPos.z) / milliseconds
    };
    pcard.dRot = {
      x: (r.x - pcard.curRot.x) / milliseconds,
      y: (r.y - pcard.curRot.y) / milliseconds,
      z: (r.z - pcard.curRot.z) / milliseconds
    };
    pcard.is_moving = true;
    pcard.refresh_on_stop = true;
    pcard.aniFrame = milliseconds;
  }

  FadeCard(pcard, alpha, frame) {
    if (!pcard) return;
    const milliseconds = (frame * 1000) / 60;
    pcard.dAlpha = (alpha - pcard.curAlpha) / milliseconds;
    pcard.is_fading = true;
    pcard.aniFrame = milliseconds;
  }

  ShowSelectSum() {
    if (this.CheckSelectSum()) {
      if (this.selectsum_cards.size === 0 || this.selectable_cards.length === 0) {
        if (this.callbacks.onSelectSumReady) {
          this.callbacks.onSelectSumReady(this.selected_cards);
        }
        return true;
      }
      this.select_ready = true;
    } else {
      this.select_ready = false;
    }
    if (this.callbacks.onSelectSumState) {
      this.callbacks.onSelectSumState(this.select_ready);
    }
    return false;
  }

  CheckSelectSum() {
    const selable = new Set();
    this.selectsum_all.forEach((card) => {
      card.is_selectable = false;
      card.is_selected = false;
      selable.add(card);
    });
    this.must_select_cards.forEach((card) => {
      card.is_selectable = true;
      card.is_selected = true;
      selable.delete(card);
    });
    this.selected_cards.forEach((card) => {
      card.is_selectable = true;
      card.is_selected = true;
      selable.delete(card);
    });
    this.selected_cards = [...this.selected_cards, ...this.must_select_cards];
    this.selectsum_cards.clear();
    this.selectable_cards.forEach((card) => {
      card.showMark = false;
    });

    if (this.select_mode === 0) {
      const ret = this.check_sel_sum_s(selable, 0, this.select_sumval);
      this.selectable_cards = [];
      const mustSorted = [...this.must_select_cards].sort(ClientCard.client_card_sort);
      mustSorted.forEach((card) => {
        card.is_selectable = true;
        this.selectable_cards.push(card);
        const idx = this.selected_cards.indexOf(card);
        if (idx >= 0) this.selected_cards.splice(idx, 1);
      });
      const selectedSorted = [...this.selected_cards].sort(ClientCard.client_card_sort);
      selectedSorted.forEach((card) => {
        card.is_selectable = true;
        this.selectable_cards.push(card);
      });
      const tmp = [...this.selectsum_cards].sort(ClientCard.client_card_sort);
      tmp.forEach((card) => {
        card.is_selectable = true;
        this.selectable_cards.push(card);
      });
      return ret;
    }

    let mm = -1;
    let mx = -1;
    let max = 0;
    let sumc = 0;
    let ret = false;
    this.selected_cards.forEach((card) => {
      const op1 = card.opParam & 0xffff;
      const op2 = card.opParam >> 16;
      const opmin = op2 > 0 && op1 > op2 ? op2 : op1;
      const opmax = op2 > op1 ? op2 : op1;
      if (mm === -1 || opmin < mm) mm = opmin;
      if (mx === -1 || opmax < mx) mx = opmax;
      sumc += opmin;
      max += opmax;
    });
    if (this.select_sumval <= sumc) {
      this.must_select_cards.forEach((card) => {
        const idx = this.selected_cards.indexOf(card);
        if (idx >= 0) this.selected_cards.splice(idx, 1);
      });
      return true;
    }
    if (this.select_sumval <= max && this.select_sumval > max - mx) ret = true;

    Array.from(selable).forEach((card) => {
      const op1 = card.opParam & 0xffff;
      const op2 = (card.opParam >> 16) & 0xffff;
      let m = op1;
      let sums = sumc + m;
      let ms = mm;
      if (ms === -1 || m < ms) ms = m;
      if (sums >= this.select_sumval) {
        if (sums - ms < this.select_sumval) this.selectsum_cards.add(card);
      } else {
        const left = Array.from(selable).filter((item) => item !== card);
        if (this.check_min(left, 0, this.select_sumval - sums, this.select_sumval - sums + ms - 1)) {
          this.selectsum_cards.add(card);
        }
      }
      if (op2 === 0) return;
      m = op2;
      sums = sumc + m;
      ms = mm;
      if (ms === -1 || m < ms) ms = m;
      if (sums >= this.select_sumval) {
        if (sums - ms < this.select_sumval) this.selectsum_cards.add(card);
      } else {
        const left = Array.from(selable).filter((item) => item !== card);
        if (this.check_min(left, 0, this.select_sumval - sums, this.select_sumval - sums + ms - 1)) {
          this.selectsum_cards.add(card);
        }
      }
    });

    this.selectable_cards = [];
    const mustSorted = [...this.must_select_cards].sort(ClientCard.client_card_sort);
    mustSorted.forEach((card) => {
      card.is_selectable = true;
      this.selectable_cards.push(card);
      const idx = this.selected_cards.indexOf(card);
      if (idx >= 0) this.selected_cards.splice(idx, 1);
    });
    const selectedSorted = [...this.selected_cards].sort(ClientCard.client_card_sort);
    selectedSorted.forEach((card) => {
      card.is_selectable = true;
      this.selectable_cards.push(card);
    });
    const tmp = [...this.selectsum_cards].sort(ClientCard.client_card_sort);
    tmp.forEach((card) => {
      card.is_selectable = true;
      this.selectable_cards.push(card);
    });
    return ret;
  }

  ShowSelectRace(raceMask) {
    if (this.callbacks.onShowSelectRace) {
      this.callbacks.onShowSelectRace(raceMask);
    }
  }

  check_min(left, index, min, max) {
    if (index >= left.length) return false;
    const card = left[index];
    const op1 = card.opParam & 0xffff;
    const op2 = card.opParam >> 16;
    const m = op2 > 0 && op1 > op2 ? op2 : op1;
    if (m >= min && m <= max) return true;
    return (min > m && this.check_min(left, index + 1, min - m, max - m)) || this.check_min(left, index + 1, min, max);
  }

  check_sel_sum_s(left, index, acc) {
    if (acc < 0) return false;
    if (index === this.selected_cards.length) {
      if (acc === 0) {
        const count = this.selected_cards.length - this.must_select_count;
        return count >= this.select_min && count <= this.select_max;
      }
      this.check_sel_sum_t(left, acc);
      return false;
    }
    const op = this.selected_cards[index].opParam;
    const l1 = op & 0xffff;
    const l2 = op >> 16;
    const res1 = this.check_sel_sum_s(left, index + 1, acc - l1);
    const res2 = l2 > 0 ? this.check_sel_sum_s(left, index + 1, acc - l2) : false;
    return res1 || res2;
  }

  check_sel_sum_t(left, acc) {
    const count = this.selected_cards.length + 1 - this.must_select_count;
    Array.from(left).forEach((card) => {
      if (this.selectsum_cards.has(card)) return;
      const testlist = Array.from(left).filter((item) => item !== card);
      const op = card.opParam;
      const l1 = op & 0xffff;
      const l2 = op >> 16;
      if (this.check_sum(testlist, 0, acc - l1, count)
        || (l2 > 0 && this.check_sum(testlist, 0, acc - l2, count))) {
        this.selectsum_cards.add(card);
      }
    });
  }

  check_sum(list, index, acc, count) {
    if (acc === 0) return count >= this.select_min && count <= this.select_max;
    if (acc < 0 || index >= list.length) return false;
    const card = list[index];
    const op = card.opParam;
    const l1 = op & 0xffff;
    const l2 = op >> 16;
    if ((l1 === acc || (l2 > 0 && l2 === acc)) && (count + 1 >= this.select_min) && (count + 1 <= this.select_max)) {
      return true;
    }
    return (acc > l1 && this.check_sum(list, index + 1, acc - l1, count + 1))
      || (l2 > 0 && acc > l2 && this.check_sum(list, index + 1, acc - l2, count + 1))
      || this.check_sum(list, index + 1, acc, count);
  }

  UpdateDeclarableList(refresh) {
    const checkCode = (trycode) => {
      const card = this.cardDatabase.get(trycode);
      if (!card) return null;
      return ClientField.is_declarable(card._data, this.declare_opcodes) ? card : null;
    };
    if (!refresh && this.ancard.length > 0) {
      const cache = [...this.ancard];
      this.ancard = [];
      cache.forEach((code) => {
        const card = checkCode(code);
        if (card) this.ancard.push(code);
      });
      return;
    }
    if (this.callbacks.onUpdateDeclarableList) {
      this.callbacks.onUpdateDeclarableList(this.ancard);
    }
  }

  static is_declarable(cd, opcodes) {
    const stack = [];
    let alias = false;
    let token = false;
    opcodes.forEach((opcode) => {
      switch (opcode) {
        case OPCODE.ADD: {
          if (stack.length >= 2) stack.push(stack.pop() + stack.pop());
          break;
        }
        case OPCODE.SUB: {
          if (stack.length >= 2) {
            const rhs = stack.pop();
            const lhs = stack.pop();
            stack.push(lhs - rhs);
          }
          break;
        }
        case OPCODE.MUL: {
          if (stack.length >= 2) stack.push(stack.pop() * stack.pop());
          break;
        }
        case OPCODE.DIV: {
          if (stack.length >= 2) {
            const rhs = stack.pop();
            const lhs = stack.pop();
            stack.push(lhs / rhs);
          }
          break;
        }
        case OPCODE.AND: {
          if (stack.length >= 2) stack.push(stack.pop() && stack.pop());
          break;
        }
        case OPCODE.OR: {
          if (stack.length >= 2) stack.push(stack.pop() || stack.pop());
          break;
        }
        case OPCODE.NEG: {
          if (stack.length >= 1) stack.push(-stack.pop());
          break;
        }
        case OPCODE.NOT: {
          if (stack.length >= 1) stack.push(!stack.pop());
          break;
        }
        case OPCODE.BAND: {
          if (stack.length >= 2) stack.push(stack.pop() & stack.pop());
          break;
        }
        case OPCODE.BOR: {
          if (stack.length >= 2) stack.push(stack.pop() | stack.pop());
          break;
        }
        case OPCODE.BNOT: {
          if (stack.length >= 1) stack.push(~stack.pop());
          break;
        }
        case OPCODE.BXOR: {
          if (stack.length >= 2) stack.push(stack.pop() ^ stack.pop());
          break;
        }
        case OPCODE.LSHIFT: {
          if (stack.length >= 2) {
            const rhs = stack.pop();
            const lhs = stack.pop();
            stack.push(lhs << rhs);
          }
          break;
        }
        case OPCODE.RSHIFT: {
          if (stack.length >= 2) {
            const rhs = stack.pop();
            const lhs = stack.pop();
            stack.push(lhs >> rhs);
          }
          break;
        }
        case OPCODE.ISCODE:
          if (stack.length >= 1) stack.push(cd.code === stack.pop());
          break;
        case OPCODE.ISTYPE:
          if (stack.length >= 1) stack.push(cd.type & stack.pop());
          break;
        case OPCODE.ISRACE:
          if (stack.length >= 1) stack.push(cd.race & stack.pop());
          break;
        case OPCODE.ISATTRIBUTE:
          if (stack.length >= 1) stack.push(cd.attribute & stack.pop());
          break;
        case OPCODE.GETCODE:
          stack.push(cd.code);
          break;
        case OPCODE.GETTYPE:
          stack.push(cd.type);
          break;
        case OPCODE.GETRACE:
          stack.push(cd.race);
          break;
        case OPCODE.GETATTRIBUTE:
          stack.push(cd.attribute);
          break;
        case OPCODE.ISSETCARD: {
          if (stack.length >= 1) {
            const set_code = stack.pop();
            const settype = set_code & 0xfff;
            const setsubtype = set_code & 0xf000;
            const res = cd.setcodes?.some((sc) => (sc & 0xfff) === settype && (sc & 0xf000 & setsubtype) === setsubtype);
            stack.push(Boolean(res));
          }
          break;
        }
        case OPCODE.ALLOW_ALIASES:
          alias = true;
          break;
        case OPCODE.ALLOW_TOKENS:
          token = true;
          break;
        default:
          stack.push(opcode);
          break;
      }
    });
    if (stack.length !== 1 || stack[0] === 0) return false;
    return (alias || !cd.alias) && (token || (cd.type & 0x400000) !== 0x400000);
  }
}
