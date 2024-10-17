import { NextPage } from 'next';
import QuoteForm from '../../components/QuoteForm';
import { useRouter } from 'next/navigation';

const AddQuotePage: NextPage = () => {
  const router = useRouter();

  const handleQuoteAdded = () => {
    router.push('/quotes');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">セリフを追加</h1>
      <QuoteForm onQuoteAdded={handleQuoteAdded} />
    </div>
  );
};

export default AddQuotePage;
