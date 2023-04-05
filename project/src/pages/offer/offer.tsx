import { useParams } from 'react-router-dom';
import ImagesOfOffers from '../../components/images-of-offers';
import ReviewForm from '../../components/review-form';
import PropertyItem from '../property-item';
import { useEffect, useState } from 'react';
import { Offers } from '../../types/offers';
import { CityLocation } from '../../mocks/offers';
import { getRatingColor } from '../../utils/getRatingColor';
import { AuthorizationStatus, COUNT_NEAR_OFFER } from '../../constants/constants';
import ReviewList from '../../components/review-list';
import CardList from '../../components/card-list';
import Map from '../../components/map';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCommentsAction, fetchNearOffersAction, fetchOfferByIdAction } from '../../store/api-actions';
import PropertyDescription from '../../components/property-description';
import NotFound from '../not-found';
import Badge from '../../components/badge';

const Offer = () => {
  const { id } = useParams();
  const offerId = Number(id);
  const dispatch = useAppDispatch();

  const [room, setRoom] = useState<Offers>();

  const offers = useAppSelector((state) => state.offers);
  const authStatus = useAppSelector((state) => state.authorizationStatus);
  const comments = useAppSelector((state) => state.loadComments);
  const nearOffers = useAppSelector((state) => state.nearOffers);

  useEffect(() => {
    setRoom(offers.find((offer) => offer.id === offerId));
    dispatch(fetchCommentsAction({ id: offerId }));
    dispatch(fetchNearOffersAction(offerId));
    dispatch(fetchOfferByIdAction({ id: offerId }));
  }, [offerId, dispatch]);

  if (!room) {
    return <NotFound />;
  }

  const otherOffers = nearOffers.filter((offer) => offer.id !== room.id);
  const nearOtherOffers = otherOffers.filter((offer) => offer.city.name === room.city.name);

  return (
    <main className="page__main page__main--property" >
      <section className="property">
        <div className="property__gallery-container container">
          <div className="property__gallery">
            {room.images.map((img) => (<ImagesOfOffers key={img} img={img} />))}
          </div>
        </div>
        <div className="property__container container">
          <div className="property__wrapper">
            {room.isPremium && <Badge className="property__mark" />}
            <div className="property__name-wrapper">
              <h1 className="property__name">
                {room.title}
              </h1>
            </div>
            <div className="property__rating rating">
              <div className="property__stars rating__stars">
                <span style={{ width: `${getRatingColor(room.rating)}%` }}></span>
                <span className="visually-hidden">Rating</span>
              </div>
              <span className="property__rating-value rating__value">{room.rating}</span>
            </div>
            <ul className="property__features">
              <li className="property__feature property__feature--entire">
                {room.type.replace(room.type[0], room.type[0].toUpperCase())}
              </li>
              <li className="property__feature property__feature--bedrooms">
                {room.bedrooms} Bedrooms
              </li>
              <li className="property__feature property__feature--adults">
                Max {room.maxAdults} adults
              </li>
            </ul>
            <div className="property__price">
              <b className="property__price-value">&euro;{room.price}</b>
              <span className="property__price-text">&nbsp;night</span>
            </div>
            <div className="property__inside">
              <h2 className="property__inside-title">What&apos;s inside</h2>
              <ul className="property__inside-list">
                {room.goods.map((item) => (
                  <PropertyItem key={item} item={item} />
                ))}
              </ul>
            </div>
            <div className="property__host">
              <h2 className="property__host-title">Meet the host</h2>
              <div className="property__host-user user">
                <div className="property__avatar-wrapper property__avatar-wrapper--pro user__avatar-wrapper">
                  <img className="property__avatar user__avatar" src={room.host.avatarUrl} width="74" height="74" alt="Host avatar" />
                </div>
                <span className="property__user-name">
                  {room.host.name}
                </span>
                {room.host.isPro && <span className="property__user-status">Pro</span>}
              </div>
              <div className="property__description">
                <PropertyDescription description={room.description} />
              </div>
            </div>
            <section className="property__reviews reviews">
              <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{comments.length}</span></h2>
              <ReviewList comments={comments} />
              {authStatus === AuthorizationStatus.Auth ? <ReviewForm offerId={offerId} /> : null}
            </section>
          </div>
        </div>
        <Map
          className="property__map"
          city={CityLocation}
          offers={[room, ...nearOtherOffers.slice(0, COUNT_NEAR_OFFER)]}
          selectedOfferId={room.id}
        />
      </section>
      <div className="container">
        <section className="near-places places">
          <h2 className="near-places__title">Other places in the neighbourhood</h2>
          <div className="near-places__list places__list">
            <CardList
              offers={nearOtherOffers.slice(0, COUNT_NEAR_OFFER)}
              cardType="property"
            />
          </div>
        </section>
      </div>
    </main >
  );
};

export default Offer;
