import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  onSubmit: (rating?: number, comment?: string) => void;
  onCancel: () => void;
  disabled?: boolean; // Add disabled prop
  disableComments?: boolean; // Add disableComments prop
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  initialRating = 0,
  initialComment = '',
  onSubmit,
  onCancel,
  disabled = false, // Default to false
  disableComments = false // Default to false
}) => {
  const [rating, setRating] = useState<number | undefined>(initialRating || undefined);
  const [comment, setComment] = useState(initialComment || '');
  const [hoverRating, setHoverRating] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    setRating(initialRating || undefined);
    setComment(initialComment || '');
    // Clear error when disabled state changes
    if (disabled) {
      setError('');
    }
  }, [initialRating, initialComment, disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return; // Do nothing if the form is disabled

    // Adjust validation based on disableComments prop
    if (!rating && (disableComments || !comment.trim())) {
       setError(disableComments ? 'Please provide a rating' : 'Please provide either a rating or a comment');
       return;
    }

    // Clear any previous errors
    setError('');

    // Submit the review
    onSubmit(rating, disableComments ? undefined : (comment.trim() || undefined));
  };

  const isCommentDisabled = disabled || disableComments;
  const isRatingDisabled = disabled;

  return (
    <div className={`bg-gray-700 rounded-lg p-5 mb-6 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <h3 className="text-xl font-semibold text-white mb-4">
        {initialRating || initialComment ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {error && !disabled && ( // Only show error if not disabled
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className={`block mb-2 ${isRatingDisabled ? 'text-gray-500' : 'text-gray-300'}`}>Rating</label>
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => !isRatingDisabled && setRating(star === rating ? undefined : star)}
                onMouseEnter={() => !isRatingDisabled && setHoverRating(star)}
                onMouseLeave={() => !isRatingDisabled && setHoverRating(0)}
                className={`focus:outline-none ${isRatingDisabled ? 'cursor-not-allowed' : ''}`}
                disabled={isRatingDisabled} // Disable rating buttons
              >
                <Star
                  size={28}
                  className={`
                    ${(hoverRating && !isRatingDisabled ? star <= hoverRating : star <= (rating || 0))
                      ? 'text-yellow-400 fill-yellow-400'
                      : isRatingDisabled ? 'text-gray-600' : 'text-gray-500'}
                    transition-colors
                    ${isRatingDisabled ? '' : 'group-hover:text-yellow-300'}
                  `}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="comment" className={`block mb-2 ${isCommentDisabled ? 'text-gray-500' : 'text-gray-300'}`}>
            Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            value={comment}
            onChange={(e) => !isCommentDisabled && setComment(e.target.value)}
            placeholder={isCommentDisabled ? "Comments are disabled" : "Share your thoughts about this game..."}
            className={`w-full px-3 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 ${
              isCommentDisabled
                ? 'text-gray-500 border-gray-700 cursor-not-allowed'
                : 'text-white border-gray-600'
            }`}
            disabled={isCommentDisabled} // Disable textarea
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className={`px-4 py-2 rounded-md transition-colors ${
              disabled
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
            disabled={disabled} // Disable cancel button
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded-md transition-colors ${
              disabled
                ? 'bg-violet-800 text-gray-500 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-700 text-white'
            }`}
            disabled={disabled} // Disable submit button
          >
            {initialRating || initialComment ? 'Update Review' : 'Submit Review'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;