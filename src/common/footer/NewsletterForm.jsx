import React, { useState } from 'react';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNewsletterSubscribe } from "../../services/contactServices";

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subscribeMutation = useNewsletterSubscribe();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await subscribeMutation.mutateAsync(email);

      if (data.status === 1) {
        toast.success(data.message || 'Subscribed successfully!');
        setEmail('');
      } else {
        toast.error(data.error || 'Subscription failed');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <form onSubmit={handleSubmit}>
        <label>
       Get weekly tech, career & exam updates from PrephQ.
        </label>
        <input
            type="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting} title={isSubmitting ? 'Submitting...' : 'Subscribe'}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="19"
            viewBox="0 0 22 19"
            fill="none"
        >
            <path
            d="M21.4174 1.04649C21.5217 0.576921 21.0521 0.176921 20.6 0.342139L0.95649 7.84649C0.843446 7.88996 0.739099 7.96823 0.669533 8.07257C0.599968 8.17692 0.565186 8.29866 0.565186 8.4204C0.565186 8.54214 0.599968 8.66388 0.669533 8.76822C0.739099 8.87257 0.834751 8.95083 0.95649 8.99431L6.47823 11.1247V17.8378C6.47823 17.9769 6.52171 18.1074 6.60866 18.2204C6.69562 18.3247 6.81736 18.403 6.94779 18.4378C7.07823 18.4726 7.22606 18.4552 7.34779 18.3943C7.46953 18.3334 7.57388 18.2378 7.63475 18.1161L9.91301 13.5856L15.4869 17.7161C15.8261 17.9682 16.313 17.8117 16.4348 17.403C21.6348 0.350833 21.4087 1.08996 21.4174 1.04649ZM16.5739 3.19431L6.99997 10.0117L2.87823 8.4204L16.5652 3.19431H16.5739ZM7.69562 11.0204L16.0348 5.08127C8.85214 12.6552 9.23475 12.2552 9.19997 12.2987C9.15649 12.3595 9.27823 12.116 7.69562 15.2726V11.0204ZM15.5217 16.2204L10.6174 12.5856L19.4782 3.2204L15.513 16.2117L15.5217 16.2204Z"
            fill="#57CC99"
            />
        </svg>
        </button>
    </form>
        
    </>
  );
};

export default NewsletterForm;
