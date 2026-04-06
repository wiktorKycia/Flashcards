import {useGetAPI} from "../../hooks/useGetAPI.ts";

export default function Home()
{
    const {data} = useGetAPI('http://localhost:3000/')

    console.log(data)

    return (
        <div>{data.content}</div>
    )
}