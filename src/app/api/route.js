export async function GET (request){
    const data = { id: 1, name: "John"}
    return Response.json({data})
}