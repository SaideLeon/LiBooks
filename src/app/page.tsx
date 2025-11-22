
import { UserProvider } from '@/hooks/use-user';
import MainApp from '@/components/MainApp';


export default function Home() {
    return (
        <UserProvider>
            <MainApp />
        </UserProvider>
    )
}
