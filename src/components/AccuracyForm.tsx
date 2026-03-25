interface AccuracyFormProps {
    accuracy: number[];
}

const CDEFGAB = "CDEFGAB";

export default function AccuracyForm({
    accuracy
}: AccuracyFormProps) {
    return (
        <div>正确率表格
            {accuracy.map((acc, index) => {
                return <div key={index} className="border">{CDEFGAB[index]}{"-->"}{acc}%</div>;
            })}
        </div>
    );
}
