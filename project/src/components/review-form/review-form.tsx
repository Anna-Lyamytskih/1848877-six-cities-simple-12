import { useAppDispatch } from '../../hooks';
import { sendCommentAction } from '../../store/api-actions';
import { ReviewComment } from '../../types/review';
import Rating from '../rating';
import { REVIEW_STARS, ReviewLength } from './constants';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import './review-form.css'

type ReviewFormProps = {
  offerId: number;
}

const ReviewForm = ({ offerId }: ReviewFormProps) => {
  const dispatch = useAppDispatch();

  const [data, setData] = useState<{ rating: string; review: string }>({
    rating: '',
    review: '',
  });

  const [isSubmitDisabled, setSubmitDisabled] = useState(false);
  const [isFormDisabled, setFormDisabled] = useState(false);
console.log(isFormDisabled, isSubmitDisabled)
  useEffect(() => {
    const isDisable = !!(data.review.length > ReviewLength.Max || data.review.length < ReviewLength.Min || !data.rating);
    setSubmitDisabled(isDisable);
  }, [data.rating, data.review]);

  const changeDataHandle = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [evt.target.name]: evt.target.value });
  };

  const onSubmit = (reviewData: ReviewComment) => {
    setFormDisabled(true);
    dispatch(sendCommentAction(reviewData));
    clearForm();
  };

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    onSubmit({
      hotelId: offerId,
      rating: Number(data.rating),
      comment: data.review,
    });
  };

  const clearForm = () => {
    if (data.rating) {
      const ratingElement = document.getElementById(`${data.rating}-stars`);
      if (ratingElement) {
        (ratingElement as HTMLInputElement).checked = false;
      }
    }
    setData({
      rating: '',
      review: ''
    });
    setSubmitDisabled(false);
    setFormDisabled(false)
  };

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={handleSubmit}>
      <fieldset disabled={isFormDisabled} className="fieldset">
        <label className="reviews__label form__label" htmlFor="review">Your review</label>
        <div className="reviews__rating-form form__rating">
          {REVIEW_STARS.map((star) => (
            <Rating
              key={star.value}
              value={star.value}
              title={star.title}
              onChangeData={changeDataHandle}
            />))}
        </div>
        <textarea onChange={changeDataHandle} className="reviews__textarea form__textarea" id="review" name="review" placeholder="Tell how was your stay, what you like and what can be improved" value={data.review}></textarea>
        <div className="reviews__button-wrapper">
          <p className="reviews__help">
            To submit review please make sure to set {''} <span className="reviews__star">rating</span> and describe your stay with at least <b className="reviews__text-amount">{ReviewLength.Min}characters</b>.
          </p>
          <button className="reviews__submit form__submit button" type="submit" disabled={isSubmitDisabled}>Submit</button>
        </div>
      </fieldset>
    </form>
  );
};

export default ReviewForm;
