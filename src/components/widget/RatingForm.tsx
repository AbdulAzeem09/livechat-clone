import React from 'react';
import { Check, Star } from 'lucide-react';
import { Button } from '../shared/Button';

interface RatingFormProps {
  onSubmit: (rating: number, feedback: string) => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = React.useState(0);
  const [feedback, setFeedback] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, feedback);
    }
  };

  return (
    <div className="p-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      <h2 className="text-xl font-semibold text-lc-gray-900 mb-2">
        Chat ended
      </h2>
      <p className="text-lc-gray-600 mb-6">
        How would you rate this conversation?
      </p>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`w-10 h-10 transition-colors ${
                rating >= star ? 'text-lc-yellow' : 'text-lc-gray-300 hover:text-lc-yellow'
              }`}
            >
              <Star className="w-full h-full fill-current" />
            </button>
          ))}
        </div>

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 border border-lc-gray-300 rounded-lg resize-none mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-lc-orange"
          placeholder="Tell us more about your experience..."
          rows={3}
        />

        <Button
          type="submit"
          disabled={rating === 0}
          className="w-full py-3 bg-lc-orange hover:bg-lc-orange-hover text-white font-semibold rounded-lg disabled:opacity-50"
        >
          Submit feedback
        </Button>
      </form>
    </div>
  );
};
