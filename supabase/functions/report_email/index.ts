import {SMTPClient} from "https://deno.land/x/denomailer/mod.ts";
import {createClient} from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        })
    }

    const authHeader = req.headers.get('Authorization')!
    let teamId;
    try {
        const requestBody = await req.json();
        teamId = requestBody.teamId;
    } catch (e) {
        return new Response(
            JSON.stringify({ message: "Invalid JSON input" }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
    const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        {global: {headers: {Authorization: authHeader}}}
    )
    let { data: teamData, error: teamError } = await supabaseClient
        .from('teams')
        .select(`
            *,
            partners (
                *
            ),
            user_teams (
                profiles!inner(
                    *
                )
            ),
            tags (
                *
            )
        `)
        .eq('id',teamId)
        .limit(1)
        .single();
    if (teamError) return new Response(
        JSON.stringify(error),
        {
            status: 500,
            headers: {'Content-Type': 'application/json'},
        }
    )
    const { data } = await supabaseClient.auth.getUser()
    const email = data.user.email;
    if (email == null) return new Response(
        JSON.stringify({
            message: "You are not authorized"
        }),
        {
            status: 403,
            headers: {'Content-Type': 'application/json'},
        }
    );
    const emailClient = new SMTPClient({
        connection: {
            hostname: Deno.env.get('SMTP_HOSTNAME'),
            port: parseInt(Deno.env.get('SMTP_PORT')),
            tls: true,
            auth: {
                username: Deno.env.get('SMTP_USERNAME'),
                password: Deno.env.get('SMTP_PASSWORD')
            },
        }
    });
    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        .header { background-color: #333340; border-radius: 6px; color: white; text-align: center; padding: 4px; }
        .content { margin: 20px; }
        .section { margin-bottom: 20px; }
        .section-title { font-size: 20px; color: #333; margin-bottom: 10px; }
        .table { width: 100%; border-collapse: collapse; border-radius: 12px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .tag-color { width: 20px; height: 20px; border-radius: 50%; display: inline-block; }
        footer { text-align: center; color: #777 }
    </style>
</head>
<body>
    <div class="header">
        <h1>${teamData.name}</h1>
    </div>
    <div class="content">
        <div class="section">
            <h2 class="section-title">Partners</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Partner Name</th>
                        <th>Type</th>
                        <th>Contacts</th>
                    </tr>
                </thead>
                <tbody>
                    ${teamData?.partners?.map(partner => `<tr>
                        <td>${partner.name}</td>
                        <td>${partner.type ?? "None"}</td>
                        <td>${partner.contacts?.join(", ") ?? ""}</td>
                    </tr>`)?.join("") ?? ""}
                </tbody>
            </table>
        </div>

        <div class="section">
            <h2 class="section-title">Tags</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Tag Name</th>
                        <th>Color</th>
                    </tr>
                </thead>
                <tbody>
                    ${teamData?.tags?.map(tag => `<tr>
                        <td>${tag.name}</td>
                        <td><span class="tag-color" style="background-color: #${tag.color?.toString(16) ?? "000"};"></span></td>
                    </tr>`)?.join("") ?? ""}
                </tbody>
            </table>
        </div>
        <div class="section">
            <h2 class="section-title">Users</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    ${teamData?.user_teams?.map(user => `<tr>
                        <td>${user.profiles.username}</td>
                        <td>${user.profiles.public_email ?? "Email is not public"}</td>
                    </tr>`)?.join("") ?? ""}
                </tbody>
            </table>
        </div>
        <footer>This report was generated by Partner Vault</footer>

    </div>

</body>
</html>
`
    try {
        let resp = await emailClient.send({
            from: `Partner Vault<${Deno.env.get('SMTP_USERNAME')}>`,
            to: email,
            subject: `Partner Vault Report - ${teamData.name}`,
            content: "Partner Vault Team Report",
            html: html,
        });
    } catch (error) {
        return new Response(JSON.stringify({message: error.message}), {status: 500, headers: {'Content-Type': 'application/json'}});
    }

    await emailClient.close();

    return new Response(
        JSON.stringify({
            done: true,
        }),
        {
            headers: {'Content-Type': 'application/json'},
        }
    )
})

// To invoke:
// curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
