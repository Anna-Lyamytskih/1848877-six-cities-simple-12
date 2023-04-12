import { makeFakeNearOffers, makeFakeOffers } from "../../utils/mocks";
import { fetchNearOffersAction } from "./api-actions";
import { nearOffersProcessSlice, setNearOffers } from "./near-offers-process";
import { NearOffersProcess } from "./types";

describe('Slice: nearOffer', () => {
  let state: NearOffersProcess;
  beforeEach(() => {
    state = {
      nearOffers: [],
    };
  });

  it('without additional parameters should return initial state', () => {
    expect(nearOffersProcessSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(state);
  });
  it('should update nearOffers upon loading from the server', () => {
    const fakeNearOffers = makeFakeNearOffers();
    const nearOfferReducer = nearOffersProcessSlice.reducer(state, {
      type: setNearOffers,
      payload: fakeNearOffers
    })

    expect(nearOfferReducer).toEqual({
      ...state,
      nearOffers: fakeNearOffers
    });
  })
});
