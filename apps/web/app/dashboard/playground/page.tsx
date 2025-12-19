import { Playground } from '@/components/demo/Playground'; // <--- Added { }

export default function PlaygroundPage() {
    return (
        <div className="h-[calc(100vh-4rem)] -m-8">
            <Playground />
        </div>
    );
}