interface AccuracyFormProps {
    accuracy: number[];
}

const CDEFGAB = "CDEFGAB";

export default function AccuracyForm({
    accuracy
}: AccuracyFormProps) {
    return (
        <div
            className="w-40"
        >正确率表格
            {accuracy.map((acc, index) => {
                return <div key={index} className="border">{CDEFGAB[index]}{"-->"}{acc.toFixed(2)}%</div>;
            })}
        </div>
    );
}
