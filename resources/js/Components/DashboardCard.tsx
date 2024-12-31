export default function DashboardCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="p-6 bg-white rounded-lg shadow h-40 dark:bg-dark-background-secondary">
            <h3 className="text-center text-lg font-bold text-gray-700 dark:text-dark-text-primary">
                {title}
            </h3>
            <p className="text-center text-5xl font-semibold text-dark-text-primary mt-7">
                {value}
            </p>
        </div>
    );
}
